import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, ActivityIndicator, Image, Alert} from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import AuthScreen from "./screens/AuthScreen";
import { FadeView } from "./components/ui/FadeView";

// Datos de usuario 
export interface UserProfile {
  username: string;
  full_name?: string;
  avatar_url?: string;
}

// Datos comentario y el autor
export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  user_id?: string;
  author?: string;  
  profiles?: UserProfile; 
}

// Datos de avistamiento con autor y comentarios
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

// Pantallas disponibles
export type Screen = "home" | "add" | "dictionary" | "profile";

// Dirección del proyecto
const PROJECT_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false); // Nuevo estado de carga inicial
  
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [sightings, setSightings] = useState<BirdSighting[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);

  // Gestion de sesion y carga inicial
  useEffect(() => {
    // 1. Verificar sesion 
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      // Pequeño delay artificial para que la animación de entrada se aprecie mejor 
      // y dar tiempo a que los datos iniciales carguen si es necesario.
      setTimeout(() => setIsReady(true), 1000);
    });

    // 2. Escuchar cambios 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setUserProfile(undefined);
        setSightings([]); // Limpiar datos al salir
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Obtiene perfil desde tabla 'profiles'
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

  // Carga todos los avistamientos
  const fetchSightings = async () => {
    if (!session) return;

    try {
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
        profiles: s.profiles, 
        comments: s.comments.map((c: any) => ({
          id: c.id.toString(),
          text: c.text,
          timestamp: c.created_at,
          user_id: c.user_id,
          profiles: c.profiles,
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

  const handleAddSighting = () => {
    fetchSightings();
    setCurrentScreen("home");
  };

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
            const { error } = await supabase.from("sightings").delete().eq("id", id);
            if (error) throw error;
            fetchSightings();
          } catch (error: any) {
            Alert.alert("Error", "No se pudo borrar");
          }
        },
      },
    ]);
  };

  const handleAddComment = async (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => {
    try {
      if (!session?.user) return;
      const { error } = await supabase.from("comments").insert({
        sighting_id: sightingId,
        user_id: session.user.id, 
        text: comment.text,
        author: userProfile?.username || "Usuario" 
      });
      if (error) throw error;
      fetchSightings();
    } catch (error: any) {
      Alert.alert("Error", "No se pudo guardar el comentario.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      if (error) throw error;
      fetchSightings();
    } catch (error: any) {
      Alert.alert("Error", "No puedes borrar este comentario.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleProfilePress = () => {
    setCurrentScreen("profile");
  };

  // --- PANTALLA DE CARGA (SPLASH) ---
  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" />
        <Image 
          source={require('./assets/adaptive-icon.png')} 
          style={{ width: 120, height: 120, marginBottom: 20 }}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  // --- App ---
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Pantalla de Login */}
      <FadeView visible={!session} style={StyleSheet.absoluteFill}>
        <AuthScreen />
      </FadeView>

      {/* Pantalla Principal*/}
      <FadeView visible={!!session} style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1 }}>
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
            currentUserId={session?.user?.id || ""}
            onRefreshSightings={fetchSightings}
            userProfile={userProfile}
            userEmail={session?.user?.email}
            onBackToHome={() => setCurrentScreen("home")}
          />
          
          <NavigationButton currentScreen={currentScreen} onChangeScreen={setCurrentScreen} />
        </View>
      </FadeView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e0f2f1" },
  splashContainer: {
    flex: 1,
    backgroundColor: "#e0f2f1", // Fondo
    alignItems: "center",
    justifyContent: "center",
  },
});