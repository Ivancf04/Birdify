import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import AuthScreen from "./screens/AuthScreen";

// Datos del perfl de usuario 
export interface UserProfile {
  username: string;
  full_name?: string;
  avatar_url?: string;
}

// Datos de un comentario, uncluido el autor
export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  user_id?: string;
  author?: string;  
  profiles?: UserProfile; 
}

// Datos de un avistamiento con autor y comentarios
export interface BirdSighting {
  id: string;
  species: string;
  location: string;
  date: string;
  time: string;
  count: number;
  notes: string;
  image?: string;
  image_path?: string;
  user_id?: string;       
  profiles?: UserProfile; 
  comments?: Comment[];
}

// Pantallas disponibles en la App (Agregamos 'profile')
export type Screen = "home" | "add" | "dictionary" | "profile";

// Dirección del proyecto en Supabase
const PROJECT_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

// Componente principal de la App
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [sightings, setSightings] = useState<BirdSighting[]>([]);
  
  // Guardamos el objeto perfil completo en lugar de solo el nombre
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);

  // Gestion de sesion
  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });

    // Escuchar cambios (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setUserProfile(undefined);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Obtiene el perfil desde la tabla 'profiles'
  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', userId)
        .single();
      if (data) setUserProfile(data);
    } catch (e) { console.log(e); }
  };

  // Carga todos los avistamientos con joins (autor + comentarios)
  const fetchSightings = async () => {
    if (!session) return;

    try {
      // Hacem un join triple para traer datos del autor y de los comentaristas
      const { data: sightingsData, error } = await supabase
        .from("sightings")
        .select(`
          *,
          profiles (username, full_name),
          comments (
            *,
            profiles (username, full_name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedData = sightingsData.map((s: any) => ({
        id: s.id.toString(),
        species: s.species,
        location: s.location,
        date: s.sighting_date,
        time: s.sighting_time,
        count: s.count,
        notes: s.notes,
        image: s.image_path ? `${PROJECT_URL}/storage/v1/object/public/photos/${s.image_path}` : undefined,
        image_path: s.image_path,
        user_id: s.user_id,
        profiles: s.profiles, // Info del creador 
        comments: s.comments.map((c: any) => ({
          id: c.id.toString(),
          text: c.text,
          timestamp: c.created_at,
          user_id: c.user_id,
          profiles: c.profiles, // Info del comentarista 
          // Muestra el nombre: Si hay perfil usa username, si no usa el autor guardado
          author: c.profiles?.username || c.author || "Anónimo"
        })),
      }));

      setSightings(mappedData);
    } catch (error) {
      console.log("Error fetching sightings:", error);
    }
  };

  useEffect(() => {
    if (session) fetchSightings();
  }, [session]);

  // Se ejecuta al agregar un avistamiento y recarga la lista
  const handleAddSighting = () => {
    fetchSightings();
    setCurrentScreen("home");
  };

  // Elimina un avistamiento solo si pertenece al usuario 
  const handleDeleteSighting = (id: string) => {
    const sighting = sightings.find(s => s.id === id);

    if (sighting?.user_id && sighting.user_id !== session?.user.id) {
      Alert.alert("Acceso denegado", "Solo puedes borrar tus propios reportes.");
      return;
    }

    Alert.alert("Confirmar", "¿Borrar avistamiento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          try {
            if (sighting?.image_path) {
              await supabase.storage.from("photos").remove([sighting.image_path]);
            }
            // La política RLS en la DB también validará que sea del usuario
            const { error } = await supabase.from("sightings").delete().eq("id", id);

            if (error) throw error;
            fetchSightings();
          } catch (error: any) {
            Alert.alert("Error", "No se pudo borrar (¿Quizás no es tuyo?)");
          }
        },
      },
    ]);
  };

  // Agrega un comentario vinculado al usuario actual
  const handleAddComment = async (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => {
    try {
      if (!session?.user) return;

      const { error } = await supabase.from("comments").insert({
        sighting_id: sightingId,
        user_id: session.user.id, // Guardamos TU ID real
        text: comment.text,
        author: userProfile?.username || "Usuario" // Guardamos también el nombre como texto (backup)
      });

      if (error) throw error;
      fetchSightings();
    } catch (error: any) {
      Alert.alert("Error", "No se pudo guardar el comentario.");
    }
  };

  // Elimina un comentario 
  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
      fetchSightings();
    } catch (error: any) {
      Alert.alert("Error", "No puedes borrar este comentario.");
    }
  };

  // Cierra la sesion del usuario 
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Navega al perfil
  const handleProfilePress = () => {
    setCurrentScreen("profile");
  };

  if (!session) return <AuthScreen />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Actualizado: Sin nombre texto, con botón de perfil */}
      <Header 
        onProfilePress={handleProfilePress} 
        onSignOut={handleSignOut} 
        currentScreen={currentScreen}
      />
      
      <MainContainer
        currentScreen={currentScreen}
        onAddSighting={handleAddSighting}
        sightings={sightings}
        onDelete={handleDeleteSighting}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        currentUserId={session.user.id}
        onRefreshSightings={fetchSightings}
        // Pasamos datos para el perfil
        userProfile={userProfile}
        userEmail={session.user.email}
        onBackToHome={() => setCurrentScreen("home")}
      />
      
      {/* Ocultamos la barra inferior si estamos en el perfil, opcionalmente */}
      <NavigationButton currentScreen={currentScreen} onChangeScreen={setCurrentScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
});