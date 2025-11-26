import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

export const NavigationButton: React.FC = () => {
  return (
    <View style={styles.wrapper}>
      <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        {/* TODO: aquí va el ícono (ej. +) o texto */}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
