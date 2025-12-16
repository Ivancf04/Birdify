import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/ProfileScreen.styles";
import type { UserProfile } from "../App";

interface ProfileScreenProps {
  userProfile?: UserProfile;
  email?: string;
  onBack: () => void;
}

export const ProfileScreen = ({ userProfile, email, onBack }: ProfileScreenProps) => {
  // Obtener iniciales para el avatar
  const getInitials = () => {
    if (userProfile?.full_name) {
      const names = userProfile.full_name.split(" ");
      if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
      return names[0][0].toUpperCase();
    }
    if (userProfile?.username) return userProfile.username[0].toUpperCase();
    return "U";
  };

  return (
    <View style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
      </View>

      {/* Main Info */}
      <Text style={styles.name}>{userProfile?.full_name || "Usuario Birdify"}</Text>
      <Text style={styles.username}>@{userProfile?.username || "usuario"}</Text>

      {/* Details Card */}
      <View style={styles.infoCard}>
        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Feather name="mail" size={20} color="#059669" />
          </View>
          <View>
            <Text style={styles.rowLabel}>Correo Electrónico</Text>
            <Text style={styles.rowValue}>{email || "No disponible"}</Text>
          </View>
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={styles.rowIcon}>
            <Feather name="calendar" size={20} color="#059669" />
          </View>
          <View>
            <Text style={styles.rowLabel}>Miembro desde</Text>
            <Text style={styles.rowValue}>2025</Text> 
          </View>
        </View>
      </View>
    </View>
  );
};