import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/Header.styles";

interface HeaderProps {
  onProfilePress?: () => void;
  onSignOut?: () => void;
  currentScreen?: string; 
}

export const Header = ({ onProfilePress, onSignOut, currentScreen }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.contentRow}>
        
        
        <Pressable onPress={onProfilePress} style={styles.iconButton}>
          <Feather name="user" size={20} color="#ffffff" />
        </Pressable>

        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Birdify</Text>
        </View>

        
        <Pressable onPress={onSignOut} style={styles.iconButton}>
          <Feather name="log-out" size={20} color="#ffffff" />
        </Pressable>

      </View>
    </View>
  );
};