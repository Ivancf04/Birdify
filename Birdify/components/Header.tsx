import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/Header.styles";

interface HeaderProps {
  userName?: string;
  onSignOut?: () => void;
}

export const Header = ({ userName, onSignOut }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.contentRow}>
        <View>
          <Text style={styles.title}>Birdify</Text>
          {userName ? (
            <Text style={styles.subtitle}>Hola, {userName}</Text>
          ) : null}
        </View>

        {onSignOut && (
          <Pressable onPress={onSignOut} style={styles.signOutButton}>
            <Feather name="log-out" size={20} color="#ffffff" />
          </Pressable>
        )}
      </View>
    </View>
  );
};