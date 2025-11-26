import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Header } from "./components/Header";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      {/* Aquí luego irá el Main y la navegación */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
});