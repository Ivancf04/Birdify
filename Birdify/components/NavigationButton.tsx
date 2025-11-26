import React from "react";
import { View, Pressable } from "react-native";
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
        {/* icono o texto pendiente */}
      </Pressable>
    </View>
  );
};
