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
  // Destructure the new props
  onDeleteComment,
  currentUserId,
  onRefreshSightings,
}) => {
  return (
    <View style={styles.main}>
      {currentScreen === "home" && (
        <HomeScreen
          sightings={sightings}
          onDelete={onDelete}
          onAddComment={onAddComment}
          // Pass the new props to HomeScreen
          onDeleteComment={onDeleteComment}
          currentUserId={currentUserId}
          onRefreshSightings={onRefreshSightings}
        />
      )}

      {currentScreen === "add" && (
        <AddReportScreen onSubmit={onAddSighting} />
      )}

      {currentScreen === "dictionary" && <DictionaryScreen />}
    </View>
  );
};