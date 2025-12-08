// Importa React y estado local
import React, { useState } from "react";
// Importa componentes UI de React Native
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./styles/HomeScreen.styles";
// Tipos de datos para avistamientos y comentarios
import type { BirdSighting, Comment } from "../App";
// Tarjeta individual de avistamiento
import SightingCard from "./SightingCard";

// Propiedades que recibe HomeScreen
interface HomeScreenProps {
  sightings: BirdSighting[];
  onDelete: (id: string) => void;
  onAddComment: (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: string;
  onRefreshSightings: () => Promise<void> | void;
}

export default function HomeScreen({
  sightings,
  onDelete,
  onAddComment,
  onDeleteComment,
  currentUserId,
  onRefreshSightings,
}: HomeScreenProps) {
  // Controla el estado del "pull to refresh"
  const [refreshing, setRefreshing] = useState(false);

  // Ejecuta la función para recargar los avistamientos
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await onRefreshSightings();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    // Ajusta la vista cuando aparece el teclado
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
    >
      <View style={styles.screen}>
        <View style={styles.mainCard}>
          {/* Encabezado de la pantalla */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Recent Sightings</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {sightings.length}{" "}
                {sightings.length === 1 ? "sighting" : "sightings"}
              </Text>
            </View>
          </View>

          {/* Mensaje si no hay avistamientos */}
          {sightings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No sightings reported yet. Start by reporting your first bird
                sighting!
              </Text>
            </View>
          ) : (
            // Lista de avistamientos con soporte para refresh
            <FlatList
              data={sightings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SightingCard
                  sighting={item}
                  onDelete={onDelete}
                  onAddComment={onAddComment}
                  onDeleteComment={onDeleteComment}
                  currentUserId={currentUserId}
                />
              )}
              contentContainerStyle={styles.listContent}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
