import React from "react";
import { View, Pressable, Text } from "react-native";
import { styles } from "./styles/NavigationButton.styles";

export const NavigationButton = () => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text>Home</Text>
        <Text>Add report</Text>
        <Text>Dictionary</Text>
      </Pressable>
    </View>
  );
};
