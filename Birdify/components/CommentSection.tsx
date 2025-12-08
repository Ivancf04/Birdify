import React, { useState, useRef } from "react";
import { View, Text, TextInput, Pressable, FlatList, Alert, Keyboard } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { Comment } from "../App";
import { styles } from "./styles/CommentSection.styles";

interface CommentSectionProps {
  sightingId: string;
  comments: Comment[];
  onAddComment: (sightingId: string, comment: Omit<Comment, "id" | "timestamp">) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: string;
  sightingOwnerId?: string;
}

// Cálcula días transcurridos desde un timestamp
const getRelativeDays = (timestamp: string) => {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return `hace ${diffDays}d`;
};

export default function CommentSection({
  sightingId,
  comments,
  onAddComment,
  onDeleteComment,
  currentUserId,
}: CommentSectionProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);
  // Estado para saber a quién estamos respondiendo 
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Enviar comentario nuevo
  const handleSubmit = () => {
    if (!text.trim()) return;
    
    onAddComment(sightingId, {
      author: "", 
      text: text.trim(),
    });
    setText("");
    setReplyingTo(null);
    Keyboard.dismiss();
  };

  // Eliminar comentario con confirmación
  const handleDelete = (commentId: string) => {
    Alert.alert("Borrar comentario", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: () => onDeleteComment(commentId) }
    ]);
  };

  // Responder a un comentario
  const handleReply = (username: string) => {
    setReplyingTo(username);
    // Pre-llenamos el input con la mención
    setText(`@${username} `);
    inputRef.current?.focus();
  };

  // Función auxiliar para renderizar el texto del comentario con estilos
  const renderCommentText = (content: string) => {
    // Regex para encontrar menciones al inicio tipo "@usuario "
    const mentionMatch = content.match(/^(@\w+)\s+(.*)/);

    if (mentionMatch) {
      const mentionedUser = mentionMatch[1]; // @usuario
      const message = mentionMatch[2];      // resto del mensaje
      return (
        <Text style={styles.commentText}>
          <Text style={{ color: "#3b82f6", fontWeight: "600" }}>{mentionedUser}</Text>{" "}
          {message}
        </Text>
      );
    }
    return <Text style={styles.commentText}>{content}</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Resumen de cantidad */}
      <View style={styles.summaryRow}>
        <Feather name="message-circle" size={14} color="#059669" />
        <Text style={styles.summaryText}>
          {comments.length === 0
            ? "Sin comentarios"
            : `${comments.length} ${comments.length === 1 ? "Comentario" : "Comentarios"}`}
        </Text>
      </View>

      {/* Lista de comentarios */}
      {comments.length > 0 && (
        <View style={styles.listWrapper}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isMyComment = item.user_id === currentUserId;
              const authorName = item.profiles?.username || item.author || "Anónimo";
              
              // Detectamos si es una respuesta para darle un estilo visual diferente (indentación)
              const isReply = item.text.startsWith("@");

              return (
                <View 
                  style={[
                    styles.commentCard, 
                    // Si empieza con @, le damos un margen a la izquierda para que parezca hilo
                    isReply && { marginLeft: 20, borderLeftWidth: 2, borderLeftColor: "#d1fae5" }
                  ]}
                >
                  <View style={styles.commentHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Text style={styles.commentAuthor}>{authorName}</Text>
                      <Text style={[styles.commentTime, { marginLeft: 8 }]}>
                        {getRelativeDays(item.timestamp)}
                      </Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                      {/* Botón Responder siempre visible si no es mi propio comentario */}
                      {!isMyComment && (
                        <Pressable onPress={() => handleReply(authorName)}>
                          <Text style={{ fontSize: 11, color: "#6b7280", fontWeight: "500" }}>Responder</Text>
                        </Pressable>
                      )}

                      {isMyComment && (
                        <Pressable onPress={() => handleDelete(item.id)}>
                          <Feather name="trash-2" size={14} color="#ef4444" />
                        </Pressable>
                      )}
                    </View>
                  </View>
                  
                  {/* Renderizado inteligente del texto */}
                  {renderCommentText(item.text)}
                </View>
              );
            }}
          />
        </View>
      )}

      {/* Formulario para escribir comentario */}
      <View style={styles.form}>
        <View style={styles.commentRow}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder={replyingTo ? `Respondiendo a @${replyingTo}...` : "Escribe un comentario..."}
            placeholderTextColor="#9ca3af"
            style={[styles.input, styles.commentInput]}
            multiline
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
