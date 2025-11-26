import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/SightingCard.style";
import type { BirdSighting, Comment } from "../App";
import { ImageWithFallback } from "../components/ImageWithFallback";
import CommentSection from "../components/CommentSection";

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
  const [showComments, setShowComments] = useState(false);

  return (
    <View style={styles.card}>
      {sighting.image && (
        <ImageWithFallback
          src={sighting.image}
          alt={sighting.species || "Bird sighting"}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        {/* cabecera */}
        <View style={styles.headerRow}>
          <View style={styles.container}>
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

        {/* meta */}
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

        {/* notas */}
        {sighting.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{sighting.notes}</Text>
          </View>
        ) : null}

        {/* botón de comentarios */}
        <View style={styles.footerRow}>
          <Pressable
            onPress={() => setShowComments((prev) => !prev)}
            style={styles.commentButton}
          >
            <Feather name="message-circle" size={14} color="#059669" />
            <Text style={styles.commentButtonText}>
              {commentCount === 0
                ? "Add comment"
                : `${commentCount} ${
                    commentCount === 1 ? "Comment" : "Comments"
                  }`}
            </Text>
          </Pressable>
        </View>

        {/* sección de comentarios */}
        {showComments && (
          <View style={styles.commentsWrapper}>
            <CommentSection
              sightingId={sighting.id}
              comments={sighting.comments || []}
              onAddComment={onAddComment}
            />
          </View>
        )}
      </View>
    </View>
  );
}
