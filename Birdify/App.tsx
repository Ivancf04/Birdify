import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";

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
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export type Screen = "home" | "add" | "dictionary";

//  IP LOCAL
const API_URL = "http://192.168.1.64/birdify/api.php";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  // 1. INICIALIZAR VACÍO: Ya no usamos datos falsos, esperamos a la BD.
  const [sightings, setSightings] = useState<BirdSighting[]>([]);

  // 2. CARGAR DATOS DE LA BD (XAMPP)
  const fetchSightings = async () => {
    try {
      const response = await fetch(`${API_URL}?action=get_sightings`);
      const data = await response.json();
      setSightings(data);
    } catch (error) {
      console.log("Error fetching data:", error);
      // si falla
      // Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

  // 4. AL AGREGAR UN REPORTE
  const handleAddSighting = (
    sighting: Omit<BirdSighting, "id" | "comments">
  ) => {
    fetchSightings(); 
    setCurrentScreen("home");
  };

// 5. BORRAR AVISTAMIENTO (Conectado a la BD)
  const handleDeleteSighting = (id: string) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de borrar este avistamiento? Se perderá la foto y los comentarios.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            try {
              // Enviamos la petición de borrado
              const formData = new FormData();
              formData.append('id', id);

              const response = await fetch(`${API_URL}?action=delete_sighting`, {
                method: 'POST',
                body: formData,
              });

              const result = await response.json();

              if (result.success) {
                // Si se borró bien, recargamos la lista
                fetchSightings();
              } else {
                Alert.alert("Error", result.error || "No se pudo borrar.");
              }
            } catch (error) {
              console.log("Error deleting:", error);
              Alert.alert("Error", "Fallo de conexión al borrar.");
            }
          },
        },
      ]
    );
  };

// 6. AGREGAR COMENTARIO (Versión corregida con FormData)
  const handleAddComment = async (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => {
    try {
      const formData = new FormData();
      formData.append('sightingId', sightingId);
      formData.append('author', comment.author);
      formData.append('text', comment.text);

      const response = await fetch(`${API_URL}?action=add_comment`, {
        method: 'POST',
        body: formData,
        // NO pongas headers manuales aquí
      });

      // TRUCO DE DEBUG: Primero obtenemos texto para ver si hay errores PHP ocultos
      const textResult = await response.text();
      console.log("Respuesta servidor:", textResult); // Míralo en tu terminal

      try {
          const result = JSON.parse(textResult);
          if (result.success) {
            fetchSightings();
          } else {
            Alert.alert("Error del Servidor", result.error);
          }
      } catch (e) {
          // Si entra aquí, es que PHP devolvió un error de texto (HTML o Warning)
          Alert.alert("Error PHP", "El servidor devolvió algo inválido: " + textResult);
      }

    } catch (error) {
      console.log("Error adding comment:", error);
      Alert.alert("Error", "Fallo de red al comentar.");
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