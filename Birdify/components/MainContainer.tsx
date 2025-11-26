// components/MainContainer.tsx
import React, { useState } from "react";
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
}

export const MainContainer: React.FC<MainContainerProps> = ({
  currentScreen,
  onAddSighting,
  sightings,
  onDelete,
  onAddComment,
}) => {
  return (
    <View style={styles.main}>
      {currentScreen === "home" && (
        <HomeScreen
          sightings={sightings}
          onDelete={onDelete}
          onAddComment={onAddComment}
        />
      )}

      {currentScreen === "add" && (
        <AddReportScreen onSubmit={onAddSighting} />
      )}

      {currentScreen === "dictionary" && <DictionaryScreen />}
    </View>
  );
};
