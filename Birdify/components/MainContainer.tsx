import React, { useState } from "react";
import { View } from "react-native";
import { styles } from "./styles/MainContainer.styles";
import HomeScreen from "../screens/HomeScreen";
import AddReportScreen from "../screens/AddReportScreen";
import type { BirdSighting, Comment, Screen } from "../App";

interface MainContainerProps {
  currentScreen: Screen;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  currentScreen,
}) => {
  const [sightings, setSightings] = useState<BirdSighting[]>([/* ... */]);

  const handleAddSighting = (
    sighting: Omit<BirdSighting, "id" | "comments">
  ) => {
    const newSighting: BirdSighting = {
      ...sighting,
      id: Date.now().toString(),
      comments: [],
    };
    setSightings((prev) => [newSighting, ...prev]);
  };

  const handleDeleteSighting = (id: string) => {
    setSightings((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddComment = (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => {
    setSightings((prev) =>
      prev.map((s) =>
        s.id === sightingId
          ? {
              ...s,
              comments: [
                ...(s.comments || []),
                {
                  ...comment,
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : s
      )
    );
  };

  return (
    <View style={styles.main}>
      {currentScreen === "home" && (
        <HomeScreen
          sightings={sightings}
          onDelete={handleDeleteSighting}
          onAddComment={handleAddComment}
        />
      )}

      {currentScreen === "add" && (
        <AddReportScreen onSubmit={handleAddSighting} />
      )}

      {/* currentScreen === "dictionary" ... */}
    </View>
  );
};
