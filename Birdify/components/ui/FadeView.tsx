import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle, View } from "react-native";

interface FadeViewProps {
  visible: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
}

export const FadeView: React.FC<FadeViewProps> = ({ 
  visible, 
  children, 
  style, 
  duration = 800 
}) => {
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration]);

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          display: visible ? "flex" : "none",
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};