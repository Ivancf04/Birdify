import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";

export interface BirdSighting {
  id: string;
  species: string;
  location: string;
  date: string;
  time: string;
  count: number;
  notes: string;
  image?: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export type Screen = "home" | "add" | "dictionary";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />

      <MainContainer currentScreen={currentScreen} />

      <NavigationButton
        currentScreen={currentScreen}
        onChangeScreen={setCurrentScreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
});
