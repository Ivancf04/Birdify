import React from "react";
import { View } from "react-native";
import { styles } from "./styles/MainContainer.styles";
import HomeScreen from "../screens/HomeScreen";
import AddReportScreen from "../screens/AddReportScreen";
import DictionaryScreen from "../screens/DictionaryScreen";
import type { BirdSighting, Comment, Screen } from "../App";

interface MainContainerProps {
  currentScreen: Screen;
  onAddSighting: (s: Omit<BirdSighting, "id" | "comments">) => void;
  sightings: BirdSighting[];
  onDelete: (id: string) => void;
  onAddComment: (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: string;
  onRefreshSightings: () => Promise<void> | void;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  currentScreen,
  onAddSighting,
  sightings,
  onDelete,
  onAddComment,
  onDeleteComment,
  currentUserId,
  onRefreshSightings,
}) => {
  return (
    // Contenedor principal donde se renderizan las pantallas
    <View style={styles.main}>
      {currentScreen === "home" && (
        <HomeScreen
          sightings={sightings}
          onDelete={onDelete}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          currentUserId={currentUserId}
          onRefreshSightings={onRefreshSightings}
        />
      )}

      {/* Si la pantalla es "add", se muestra el formulario para agregar avistamientos */}
      {currentScreen === "add" && (
        <AddReportScreen onSubmit={onAddSighting} />
      )}

      {/* Si la pantalla es "dictionary", se muestra el diccionario */}
      {currentScreen === "dictionary" && <DictionaryScreen />}
    </View>
  );
};
