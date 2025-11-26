import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import type { Comment } from "../App";
import { styles } from "./styles/CommentSection.styles";
import { TextInputField } from "./ui/TextInputField";
import { PrimaryButton } from "./ui/PrimaryButton";

interface CommentSectionProps {
  sightingId: string;
  comments: Comment[];
  onAddComment: (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => void;
}

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
      {comments.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{item.author}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
          />
        </View>
      )}

      <View style={styles.form}>
        <TextInputField
          value={author}
          onChangeText={setAuthor}
          placeholder="Your name (optional)"
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInputField
            value={text}
            onChangeText={setText}
            placeholder="Add a comment..."
            style={styles.input}
          />
          <PrimaryButton
            label="Send"
            onPress={handleSubmit}
            style={styles.sendButton}
          />
        </View>
      </View>
    </View>
  );
}
