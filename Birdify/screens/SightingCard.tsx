import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/SightingCard.style";
import type { BirdSighting, Comment } from "../App";
import { ImageWithFallback } from "../components/ImageWithFallback";

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
  const commentCount = sighting.comments?.length ?? 0;

  return (
    <View style={styles.card}>
      {/* Imagen superior */}
      {sighting.image && (
        <ImageWithFallback
          src={sighting.image}
          alt={sighting.species || "Bird sighting"}
          style={styles.image}
        />
      )}

      {/* Contenido */}
      <View style={styles.content}>
        {/* Título + eliminar */}
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

        {/* Fecha / hora / cantidad */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={14} color="#047857" />
            <Text style={styles.metaText}>{formatDate(sighting.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color="#047857" />
            <Text style={styles.metaText}>{sighting.time}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="hash" size={14} color="#047857" />
            <Text style={styles.metaText}>
              {sighting.count} {sighting.count === 1 ? "bird" : "birds"}
            </Text>
          </View>
        </View>

        {/* Notas */}
        {sighting.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{sighting.notes}</Text>
          </View>
        ) : null}

        {/* Línea inferior con comentarios */}
        <View style={styles.footerRow}>
          <View style={styles.commentRow}>
            <Feather name="message-circle" size={14} color="#047857" />
            <Text style={styles.commentText}>
              {commentCount === 0
                ? "No comments yet"
                : `${commentCount} ${
                    commentCount === 1 ? "Comment" : "Comments"
                  }`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
