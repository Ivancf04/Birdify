import React, { useState } from "react";
import { View } from "react-native";
import { styles } from "./styles/MainContainer.styles";
import HomeScreen from "../screens/HomeScreen";
import type { BirdSighting, Comment } from "../App";

type Screen = "home" | "add" | "dictionary";

export const MainContainer = () => {
  const [currentScreen] = useState<Screen>("home");

  const [sightings, setSightings] = useState<BirdSighting[]>([
    {
      id: "1",
      species: "American Robin",
      location: "Central Park, New York",
      date: "2024-11-20",
      time: "08:30",
      count: 3,
      notes: "Spotted near the pond, actively foraging",
      image:
        "https://images.unsplash.com/photo-1584888890205-9b49eaf0c660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      comments: [
        {
          id: "c1",
          author: "BirdLover42",
          text: "Great shot! Definitely an American Robin based on the orange breast.",
          timestamp: "2024-11-20T09:15:00",
        },
      ],
    },
    {
      id: "2",
      species: "Blue Jay",
      location: "Prospect Park, Brooklyn",
      date: "2024-11-22",
      time: "14:15",
      count: 2,
      notes: "Beautiful plumage, heard distinctive call",
      image:
        "https://images.unsplash.com/photo-1552728089-57bdde30beb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      comments: [],
    },
  ]);

  const handleDeleteSighting = (id: string) => {
    setSightings(prev => prev.filter(s => s.id !== id));
  };

  const handleAddComment = (
    sightingId: string,
    comment: Omit<Comment, "id" | "timestamp">
  ) => {
    setSightings(prev =>
      prev.map(s => {
        if (s.id !== sightingId) return s;
        const newComment: Comment = {
          ...comment,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };
        return {
          ...s,
          comments: [...(s.comments || []), newComment],
        };
      })
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
    </View>
  );
};
