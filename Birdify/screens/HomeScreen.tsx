import React from "react";
import { View, Text, FlatList } from "react-native";
import type { BirdSighting, Comment } from "../App";
import { styles } from "./styles/HomeScreen.styles";
import { Card } from "../components/ui/Card";
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
  const renderItem = ({ item }: { item: BirdSighting }) => (
    <SightingCard
      sighting={item}
      onDelete={onDelete}
      onAddComment={onAddComment}
    />
  );

  return (
    <View style={styles.container}>
      {/* header de sección */}
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
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No sightings reported yet. Start by reporting your first bird
            sighting!
          </Text>
        </Card>
      ) : (
        <FlatList
          data={sightings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}
