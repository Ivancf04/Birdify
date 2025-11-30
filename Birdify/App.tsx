import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import AuthScreen from "./screens/AuthScreen";

// 1. Nuevas interfaces para manejar datos relacionales
export interface UserProfile {
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  user_id?: string;
  author?: string;     // Nombre textual (fallback)
  profiles?: UserProfile; // Datos reales del autor (join)
}

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
  user_id?: string;       // ID del dueño
  profiles?: UserProfile; // Datos del dueño (join)
  comments?: Comment[];
}

export type Screen = "home" | "add" | "dictionary";

const PROJECT_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [sightings, setSightings] = useState<BirdSighting[]>([]);
  const [userName, setUserName] = useState("");

  // ─── GESTIÓN DE SESIÓN ────────────────────────────────────────────────
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
      else setUserName("");
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función para obtener el perfil desde la tabla 'profiles'
  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', userId)
        .single();
      if (data) setUserName(data.username || data.full_name || "Usuario");
    } catch (e) { console.log(e); }
  };

  // ─── CARGAR DATOS (CON RELACIONES) ────────────────────────────────────
  const fetchSightings = async () => {
    if (!session) return;

    try {
      // Hacemos un JOIN triple para traer datos del autor y de los comentaristas
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
        profiles: s.profiles, // Info del creador (@sasa)
        comments: s.comments.map((c: any) => ({
          id: c.id.toString(),
          text: c.text,
          timestamp: c.created_at,
          user_id: c.user_id,
          profiles: c.profiles, // Info del comentarista (@ivan)
          // Lógica para mostrar nombre: Si hay perfil usa username, si no usa el author guardado
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

  // ─── BORRAR AVISTAMIENTO (Solo si eres el dueño) ──────────────────────
  const handleDeleteSighting = (id: string) => {
    const sighting = sightings.find(s => s.id === id);

    // Validación visual extra: ¿Es mío?
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
            // La política RLS en la DB también validará que sea tuyo
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

  // ─── COMENTAR (Vinculado al usuario) ──────────────────────────────────
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
        author: userName // Guardamos también el nombre como texto (backup)
      });

      if (error) throw error;
      fetchSightings();
    } catch (error: any) {
      Alert.alert("Error", "No se pudo guardar el comentario.");
    }
  };

  // ─── BORRAR COMENTARIO (Nueva función) ────────────────────────────────
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

  if (!session) return <AuthScreen />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header userName={userName} onSignOut={handleSignOut} />
      <MainContainer
        currentScreen={currentScreen}
        onAddSighting={handleAddSighting}
        sightings={sightings}
        onDelete={handleDeleteSighting}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        currentUserId={session.user.id}
      />
      <NavigationButton currentScreen={currentScreen} onChangeScreen={setCurrentScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
});