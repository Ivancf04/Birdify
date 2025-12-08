import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/SightingCard.style";
import type { BirdSighting, Comment } from "../App";
import { ImageWithFallback } from "../components/ImageWithFallback";
import CommentSection from "../components/CommentSection";

// Propiedades que recibe la tarjeta de avistamiento
interface SightingCardProps {
  sighting: BirdSighting;
  onDelete: (id: string) => void;
  onAddComment: (sightingId: string, comment: Omit<Comment, "id" | "timestamp">) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: string;
}

// Formatea la fecha del avistamiento
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Componente que muestra un avistamiento completo
export default function SightingCard({
  sighting,
  onDelete,
  onAddComment,
  onDeleteComment,
  currentUserId,
}: SightingCardProps) {
  const commentCount = sighting.comments?.length ?? 0; // Numero de comentarios
  const [showComments, setShowComments] = useState(false); // Mostrar u ocultar comentarios

  // Verificar si soy el dueño para mostrar el botón de borrar
  const isMySighting = sighting.user_id === currentUserId;
  const authorName = sighting.profiles?.username || "Anónimo";

  return (
    <View style={styles.card}>
      {/* Imagen del avistamiento con fallback */}
      {sighting.image && (
        <ImageWithFallback
          src={sighting.image}
          alt={sighting.species || "Bird sighting"}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.container}>
            <Text style={styles.species}>
              {sighting.species || "Unknown Species"}
            </Text>
            <View style={styles.locationRow}>
              <Feather name="user" size={14} color="#059669" />
              {/* Usuario que lo subió */}
              <Text style={[styles.locationText, { fontWeight: "bold", marginBottom: 2 }]}>@{authorName}</Text>
            </View>
            {/* Ubicación */}
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color="#059669" />
              <Text style={styles.locationText}>{sighting.location}</Text>
            </View>
          </View>

          {/* SOLO mostramos el botón de borrar si es MI avistamiento */}
          {isMySighting && (
            <Pressable
              onPress={() => onDelete(sighting.id)}
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed,
              ]}
            >
              <Feather name="trash-2" size={18} color="#ef4444" />
            </Pressable>
          )}
        </View>

        {/* Fecha y hora del avistamiento */}
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

        {/* Cantidad de aves */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="hash" size={14} color="#047857" />
            <Text style={styles.metaText}>
              {sighting.count} {sighting.count === 1 ? "bird" : "birds"}
            </Text>
          </View>
        </View>

        {/* Notas opcionales */}
        {sighting.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{sighting.notes}</Text>
          </View>
        ) : null}

        {/* Botón para mostrar u ocultar comentarios */}
        <View style={styles.footerRow}>
          <Pressable
            onPress={() => setShowComments((prev) => !prev)}
            style={styles.commentButton}
          >
            <Feather name="message-circle" size={14} color="#059669" />
            <Text style={styles.commentButtonText}>
              {commentCount === 0
                ? "Comments"
                : `${commentCount} ${commentCount === 1 ? "Comment" : "Comments"}`}
            </Text>
          </Pressable>
        </View>

        {/* Sección de comentarios */}
        {showComments && (
          <View style={styles.commentsWrapper}>
            <CommentSection
              sightingId={sighting.id}
              comments={sighting.comments || []}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              currentUserId={currentUserId}
              sightingOwnerId={sighting.user_id} 
            />
          </View>
        )}
      </View>
    </View>
  );
}
