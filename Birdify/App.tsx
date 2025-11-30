import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";
import { supabase } from "./lib/supabase"; 
import { Session } from "@supabase/supabase-js";
import AuthScreen from "./screens/AuthScreen"; 

export interface BirdSighting {
  id: string;
  species: string;
  location: string;
  date: string;
  time: string;
  count: number;
  notes: string;
  image?: string;
  comments?: Comment[];
  image_path?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export type Screen = "home" | "add" | "dictionary";

const PROJECT_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [sightings, setSightings] = useState<BirdSighting[]>([]);
  
  // Estado para guardar el nombre de usuario (leído de la tabla profiles)
  const [userName, setUserName] = useState(""); 

  // 1. GESTIÓN DE SESIÓN Y PERFIL
  useEffect(() => {
    // A. Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id); // <--- Cargar perfil de la BD
      }
    });

    // B. Escuchar cambios (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserName(""); // Limpiar si cierra sesión
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. NUEVA FUNCIÓN: Leer tabla 'profiles'
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles') 
        .select('username, full_name')
        .eq('id', userId)
        .single();

      if (data) {
        setUserName(data.username || data.full_name || "Usuario");
      }
    } catch (e) {
      console.log("Error cargando perfil:", e);
    }
  };

  // 3. CARGAR AVISTAMIENTOS
  const fetchSightings = async () => {
    if (!session) return; 

    try {
      const { data: sightingsData, error } = await supabase
        .from("sightings")
        .select("*, comments(*)")
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
        image: s.image_path 
          ? `${PROJECT_URL}/storage/v1/object/public/photos/${s.image_path}`
          : undefined,
        image_path: s.image_path,
        comments: s.comments.map((c: any) => ({
          id: c.id.toString(),
          author: c.author,
          text: c.text,
          timestamp: c.created_at,
        })),
      }));

      setSightings(mappedData);
    } catch (error) {
      console.log("Error fetching sightings:", error);
    }
  };

  // Cargar datos si hay sesión
  useEffect(() => {
    if (session) fetchSightings();
  }, [session]);


  // ─── HANDLERS ────────────────────────────────────────────────────────
  const handleAddSighting = () => {
    fetchSightings();
    setCurrentScreen("home");
  };

  const handleDeleteSighting = (id: string) => {
    Alert.alert("Confirmar", "¿Borrar avistamiento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          try {
            const sightingToDelete = sightings.find((s) => s.id === id);
            if (sightingToDelete?.image_path) {
              await supabase.storage
                .from("photos")
                .remove([sightingToDelete.image_path]);
            }
            const { error } = await supabase.from("sightings").delete().eq("id", id);
            if (error) throw error;
            fetchSightings();
          } catch (error: any) {
            Alert.alert("Error", error.message);
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
      // Usamos el nombre REAL obtenido de la tabla profiles
      const authorName = userName || comment.author || "Anonymous";
      
      const { error } = await supabase.from("comments").insert({
        sighting_id: sightingId,
        author: authorName, // Guardamos el nombre correcto en el comentario
        text: comment.text,
      });

      if (error) throw error;
      fetchSightings();
    } catch (error: any) {
      Alert.alert("Error", "No se pudo guardar el comentario.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // ─── RENDER ──────────────────────────────────────────────────────────
  if (!session) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Pasamos el nombre obtenido de la tabla 'profiles' al Header */}
      <Header userName={userName} onSignOut={handleSignOut} />

      <MainContainer
        currentScreen={currentScreen}
        onAddSighting={handleAddSighting}
        sightings={sightings}
        onDelete={handleDeleteSighting}
        onAddComment={handleAddComment}
      />

      <NavigationButton
        currentScreen={currentScreen}
        onChangeScreen={setCurrentScreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
});