import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";
import { supabase } from "./lib/supabase"; 

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

// La URL base del proyecto Supabase (para armar links de fotos)
const PROJECT_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [sightings, setSightings] = useState<BirdSighting[]>([]);

  // 1. leer supabase
  const fetchSightings = async () => {
    try {
      // solicitud
      const { data: sightingsData, error } = await supabase
        .from("sightings")
        .select("*, comments(*)") 
        .order("created_at", { ascending: false });

      if (error) throw error;

      // transformar datos
      const mappedData = sightingsData.map((s: any) => ({
        id: s.id.toString(),
        species: s.species,
        location: s.location,
        date: s.sighting_date,
        time: s.sighting_time,
        count: s.count,
        notes: s.notes,
        // url publica de photos
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

  useEffect(() => {
    fetchSightings();
  }, []);

  const handleAddSighting = () => {
    fetchSightings(); 
    setCurrentScreen("home");
  };

  // 2. borrar en supabase
  const handleDeleteSighting = (id: string) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro? Se borrará permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            try {
              const sightingToDelete = sightings.find(s => s.id === id);
              // borrar photo si existe con el id
              if (sightingToDelete?.image_path) {
                await supabase.storage
                  .from("photos")
                  .remove([sightingToDelete.image_path]);
              }
              // borar registro de la BD
              const { error } = await supabase.from("sightings").delete().eq("id", id);
              if (error) throw error;
              fetchSightings();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  // 3. comentar en supabase
  const handleAddComment = async (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => {
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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