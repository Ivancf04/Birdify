import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";
import { NavigationButton } from "./components/NavigationButton";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <MainContainer />
      <NavigationButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
});
