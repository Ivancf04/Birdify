import React from "react";
import { View, StyleSheet } from "react-native";

export const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      {}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,            
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.3)",
  },
});
