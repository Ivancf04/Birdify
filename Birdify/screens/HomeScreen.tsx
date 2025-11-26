import React from "react";
import { View, Text, FlatList } from "react-native";
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
}

export default function HomeScreen({
  sightings,
  onDelete,
  onAddComment,
}: HomeScreenProps) {
  return (
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

        {/* Lista o estado vacío */}
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
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}
