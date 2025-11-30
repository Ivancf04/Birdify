import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { Comment } from "../App";
import { styles } from "./styles/CommentSection.styles";

interface CommentSectionProps {
  sightingId: string;
  comments: Comment[];
  onAddComment: (sightingId: string, comment: Omit<Comment, "id" | "timestamp">) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: string;
  sightingOwnerId?: string; // ID del dueño del avistamiento
}

const getRelativeDays = (timestamp: string) => {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  return `${diffDays}d ago`;
};

export default function CommentSection({
  sightingId,
  comments,
  onAddComment,
  onDeleteComment,
  currentUserId,
  sightingOwnerId,
}: CommentSectionProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    // Ya no pedimos 'author', se infiere en el backend
    onAddComment(sightingId, {
      author: "", 
      text: text.trim(),
    });
    setText("");
  };

  const handleDelete = (commentId: string) => {
    Alert.alert("Borrar comentario", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: () => onDeleteComment(commentId) }
    ]);
  };

  // Si soy el dueño del avistamiento, NO muestro el input
  const canComment = currentUserId !== sightingOwnerId;

  return (
    <View style={styles.container}>
      {/* Resumen */}
      <View style={styles.summaryRow}>
        <Feather name="message-circle" size={14} color="#059669" />
        <Text style={styles.summaryText}>
          {comments.length === 0
            ? "No comments yet"
            : `${comments.length} ${comments.length === 1 ? "Comment" : "Comments"}`}
        </Text>
      </View>

      {/* Lista de comentarios */}
      {comments.length > 0 && (
        <View style={styles.listWrapper}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isMyComment = item.user_id === currentUserId;
              const authorName = item.profiles?.username || item.author || "Anónimo";

              return (
                <View style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.commentAuthor}>@{authorName}</Text>
                      <Text style={[styles.commentTime, { marginLeft: 8 }]}>
                        {getRelativeDays(item.timestamp)}
                      </Text>
                    </View>
                    
                    {/* Solo muestro borrar si es MI comentario */}
                    {isMyComment && (
                      <Pressable onPress={() => handleDelete(item.id)}>
                        <Feather name="trash-2" size={14} color="#ef4444" />
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* Formulario (Solo si NO soy el dueño del post) */}
      {canComment ? (
        <View style={styles.form}>
          <View style={styles.commentRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Add a comment..."
              placeholderTextColor="#51aa87ff"
              style={[styles.input, styles.commentInput]}
            />
            <Pressable
              onPress={handleSubmit}
              style={styles.sendButton}
              android_ripple={{ color: "#bbf7d0", borderless: true }}
            >
              <Feather name="send" size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginTop: 8 }}>
          No puedes comentar en tu propio avistamiento.
        </Text>
      )}
    </View>
  );
}