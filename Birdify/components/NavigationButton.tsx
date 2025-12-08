import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/NavigationButton.styles";
import type { Screen } from "../App";

interface NavigationButtonProps {
  currentScreen: Screen;
  onChangeScreen: (screen: Screen) => void;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  currentScreen,
  onChangeScreen,
}) => {
  // Tabs disponibles en la navegación inferior
  // Cada tab tiene una clave, un texto visible y un ícono
  const tabs: { key: Screen; label: string; icon: React.ComponentProps<typeof Feather>["name"] }[] =
    [
      { key: "home", label: "Home", icon: "home" },
      { key: "add", label: "Add Report", icon: "plus-circle" },
      { key: "dictionary", label: "Dictionary", icon: "book-open" },
    ];

  return (
    // Contenedor principal de la barra de navegación
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChangeScreen(tab.key)}
            style={styles.tab}
          >
            {/* Ícono del tab */}
            <Feather
              name={tab.icon}
              size={22}
              color={isActive ? "#059669" : "#4b5563"}
            />
            {/* Texto del botón */}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
