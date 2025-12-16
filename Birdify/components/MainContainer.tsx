import React from "react";
import { View } from "react-native";
import { styles } from "./styles/MainContainer.styles";
import HomeScreen from "../screens/HomeScreen";
import AddReportScreen from "../screens/AddReportScreen";
import DictionaryScreen from "../screens/DictionaryScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { FadeView } from "./ui/FadeView"; // Importamos el componente reutilizable
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
      <FadeView visible={currentScreen === "home"}>
        <HomeScreen
          sightings={sightings}
          onDelete={onDelete}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          currentUserId={currentUserId}
          onRefreshSightings={onRefreshSightings}
        />
      </FadeView>

      <FadeView visible={currentScreen === "add"}>
        <AddReportScreen onSubmit={onAddSighting} />
      </FadeView>

      <FadeView visible={currentScreen === "dictionary"}>
        <DictionaryScreen />
      </FadeView>

      <FadeView visible={currentScreen === "profile"}>
        <ProfileScreen 
          userProfile={userProfile} 
          email={userEmail} 
          onBack={onBackToHome} 
        />
      </FadeView>
    </View>
  );
};