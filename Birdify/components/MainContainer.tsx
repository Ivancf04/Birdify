import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { styles } from "./styles/MainContainer.styles";
import HomeScreen from "../screens/HomeScreen";
import AddReportScreen from "../screens/AddReportScreen";
import DictionaryScreen from "../screens/DictionaryScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
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


const FadeScreen = ({ visible, children }: { visible: boolean; children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0); 
      Animated.timing(fadeAnim, {
        toValue: 1, 
        duration: 370, // duracion en ms
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={{
        flex: 1,
        display: visible ? "flex" : "none",
        opacity: fadeAnim,
      }}
    >
      {children}
    </Animated.View>
  );
};

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
      <FadeScreen visible={currentScreen === "home"}>
        <HomeScreen
          sightings={sightings}
          onDelete={onDelete}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          currentUserId={currentUserId}
          onRefreshSightings={onRefreshSightings}
        />
      </FadeScreen>

      <FadeScreen visible={currentScreen === "add"}>
        <AddReportScreen onSubmit={onAddSighting} />
      </FadeScreen>

      <FadeScreen visible={currentScreen === "dictionary"}>
        <DictionaryScreen />
      </FadeScreen>

      <FadeScreen visible={currentScreen === "profile"}>
        <ProfileScreen 
          userProfile={userProfile} 
          email={userEmail} 
          onBack={onBackToHome} 
        />
      </FadeScreen>
    </View>
  );
};