import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/Header.styles";

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Birdify</Text>
    </View>
  );
};
