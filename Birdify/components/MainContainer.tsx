import React from "react";
import { View, StyleSheet } from "react-native";

export const MainContainer: React.FC = () => {
  return (
    <View style={styles.main}>
      {/* TODO: aquí van las pantallas (Home, AddReport, Dictionary, etc.) */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#020617",
  },
});
