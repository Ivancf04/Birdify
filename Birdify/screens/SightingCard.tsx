import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/SightingCard.style";
import { ImageWithFallback } from "../components/ImageWithFallback";
import CommentSection from "../components/CommentSection";
import type { BirdSighting, Comment } from "../App";
import { Card } from "../components/ui/Card";

interface SightingCardProps {
  sighting: BirdSighting;
  onDelete: (id: string) => void;
  onAddComment: (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function SightingCard({
  sighting,
  onDelete,
  onAddComment,
}: SightingCardProps) {
  return (
    <Card style={styles.card}>
      {sighting.image && (
        <ImageWithFallback
          src={sighting.image}
          alt={sighting.species || "Bird sighting"}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        {/* header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.species}>
              {sighting.species || "Unknown Species"}
            </Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="#059669" />
              <Text style={styles.locationText}>{sighting.location}</Text>
            </View>
          </View>

          <Pressable
            onPress={() => onDelete(sighting.id)}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
          >
            <Feather name="trash-2" size={18} color="#ef4444" />
          </Pressable>
        </View>

        {/* meta info */}
        <View style={styles.metaGrid}>
          <View style={styles.metaRow}>
            <Feather name="calendar" size={14} color="#047857" />
            <Text style={styles.metaText}>{formatDate(sighting.date)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Feather name="clock" size={14} color="#047857" />
            <Text style={styles.metaText}>{sighting.time}</Text>
          </View>
          <View style={styles.metaRow}>
            <Feather name="hash" size={14} color="#047857" />
            <Text style={styles.metaText}>
              {sighting.count} {sighting.count === 1 ? "bird" : "birds"}
            </Text>
          </View>
        </View>

        {/* notas */}
        {sighting.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{sighting.notes}</Text>
          </View>
        ) : null}

        {/* comentarios */}
        <CommentSection
          sightingId={sighting.id}
          comments={sighting.comments || []}
          onAddComment={onAddComment}
        />
      </View>
    </Card>
  );
}
