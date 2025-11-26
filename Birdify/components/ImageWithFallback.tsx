import React, { useState } from "react";
import { Image, View, Text, StyleProp, ImageStyle } from "react-native";
import { styles } from "./styles/ImageWithFallback.styles";

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  style?: StyleProp<ImageStyle>;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  style,
}) => {
  const [didError, setDidError] = useState(false);

  if (didError) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Text style={styles.fallbackText}>
          {alt || "Error loading image"}
        </Text>

        {/* small fallback SVG-like box */}
        <View style={styles.fallbackIcon}>
          <Text style={styles.iconText}>📷</Text>
        </View>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={[styles.image, style]}
      onError={() => setDidError(true)}
    />
  );
};
