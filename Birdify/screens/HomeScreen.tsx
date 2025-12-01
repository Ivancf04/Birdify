import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "./styles/HomeScreen.styles";
import type { BirdSighting, Comment } from "../App";
import SightingCard from "./SightingCard";

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
  //Estado y función para refrescar la lista
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await onRefreshSightings();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
    >
      <View style={styles.screen}>
        <View style={styles.mainCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Recent Sightings</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {sightings.length}{" "}
                {sightings.length === 1 ? "sighting" : "sightings"}
              </Text>
            </View>
          </View>

          {sightings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No sightings reported yet. Start by reporting your first bird
                sighting!
              </Text>
            </View>
          ) : (
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
