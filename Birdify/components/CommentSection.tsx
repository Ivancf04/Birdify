import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { Comment } from "../App";
import { styles } from "./styles/CommentSection.styles";

interface CommentSectionProps {
  sightingId: string;
  comments: Comment[];
  onAddComment: (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => void;
}

const getRelativeDays = (timestamp: string) => {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return `${diffDays}d ago`;
};

export default function CommentSection({
  sightingId,
  comments,
  onAddComment,
}: CommentSectionProps) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    onAddComment(sightingId, {
      author: author.trim() || "Anonymous",
      text: text.trim(),
    });

    setText("");
  };

  return (
    <View style={styles.container}>
      {/* resumen de comentarios */}
      <View style={styles.summaryRow}>
        <Feather name="message-circle" size={14} color="#059669" />
        <Text style={styles.summaryText}>
          {comments.length === 0
            ? "No comments yet"
            : `${comments.length} ${
                comments.length === 1 ? "Comment" : "Comments"
              }`}
        </Text>
      </View>

      {/* lista de comentarios */}
      {comments.length > 0 && (
        <View style={styles.listWrapper}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{item.author}</Text>
                  <Text style={styles.commentTime}>
                    {getRelativeDays(item.timestamp)}
                  </Text>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* formulario */}
      <View style={styles.form}>
        <TextInput
          value={author}
          onChangeText={setAuthor}
          placeholder="Your name"
          placeholderTextColor="#51aa87ff"
          style={styles.input}
        />
        <View style={styles.commentRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Add a comment or suggest species..."
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
    </View>
  );
}
