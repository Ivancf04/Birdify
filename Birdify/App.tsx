import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";
import { supabase } from "./lib/supabase"; 
import { Session } from "@supabase/supabase-js";
import AuthScreen from "./screens/AuthScreen"; // <--- Importamos la nueva pantalla

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
  const [session, setSession] = useState<Session | null>(null); // <--- Estado de Sesión
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [sightings, setSightings] = useState<BirdSighting[]>([]);

  // 1. CONTROL DE SESIÓN
  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. CARGAR DATOS (Solo si hay sesión)
  const fetchSightings = async () => {
    if (!session) return; // No cargar si no hay usuario

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
      console.log("Error fetching:", error);
    }
  };

  // Cargar datos cuando cambie la sesión
  useEffect(() => {
    if (session) fetchSightings();
  }, [session]);

  const handleAddSighting = () => {
    fetchSightings(); 
    setCurrentScreen("home");
  };

  const handleDeleteSighting = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          try {
            const sightingToDelete = sightings.find(s => s.id === id);
            if (sightingToDelete?.image_path) {
              await supabase.storage.from("photos").remove([sightingToDelete.image_path]);
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

  const handleAddComment = async (sightingId: string, comment: Omit<Comment, "id" | "timestamp">) => {
    try {
      const { error } = await supabase.from("comments").insert({
        sighting_id: sightingId,
        author: comment.author,
        text: comment.text,
      });
      if (error) throw error;
      fetchSightings(); 
    } catch (error: any) {
      Alert.alert("Error", "No se pudo guardar el comentario.");
    }
  };

  // 3. CERRAR SESIÓN (Función extra para el Header o botón de salida)
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // 4. RENDERIZADO CONDICIONAL
  // Si NO hay sesión, mostramos la pantalla de Login
  if (!session) {
    return <AuthScreen />;
  }

  // Si SÍ hay sesión, mostramos la App normal
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Pasamos handleSignOut al Header si quieres poner un botón de salir ahí, 
          o puedes poner un botón temporal en Home para probar */}
      <Header /> 

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