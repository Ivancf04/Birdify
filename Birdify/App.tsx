import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Header } from "./components/Header";
import { MainContainer } from "./components/MainContainer";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <MainContainer />
      {/* Aquí luego va el botón / barra de navegación */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
});
