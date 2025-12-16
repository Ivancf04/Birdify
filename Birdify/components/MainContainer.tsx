import React from "react";
import { View, StyleSheet } from "react-native";
import { styles } from "./styles/MainContainer.styles";
import HomeScreen from "../screens/HomeScreen";
import AddReportScreen from "../screens/AddReportScreen";
import DictionaryScreen from "../screens/DictionaryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import type { BirdSighting, Comment, Screen, UserProfile } from "../App";

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
  // Nuevas props para perfil
  userProfile?: UserProfile;
  userEmail?: string;
  onBackToHome: () => void;
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
  userProfile,
  userEmail,
  onBackToHome,
}) => {
  return (
    <View style={styles.main}>
      <View style={{ flex: 1, display: currentScreen === "home" ? "flex" : "none" }}>
        <HomeScreen
          sightings={sightings}
          onDelete={onDelete}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          currentUserId={currentUserId}
          onRefreshSightings={onRefreshSightings}
        />
      </View>

      <View style={{ flex: 1, display: currentScreen === "add" ? "flex" : "none" }}>
        <AddReportScreen onSubmit={onAddSighting} />
      </View>

      <View style={{ flex: 1, display: currentScreen === "dictionary" ? "flex" : "none" }}>
        <DictionaryScreen />
      </View>

      {/* Nueva pantalla de perfil */}
      <View style={{ flex: 1, display: currentScreen === "profile" ? "flex" : "none" }}>
        <ProfileScreen 
          userProfile={userProfile} 
          email={userEmail} 
          onBack={onBackToHome} 
        />
      </View>
    </View>
  );
};