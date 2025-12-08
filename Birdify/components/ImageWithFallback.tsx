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
  // Estado para detectar si falló la carga
  const [didError, setDidError] = useState(false);

  // Si hubo error, muestra un contenedor alternativo
  if (didError) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Text style={styles.fallbackText}>
          {alt || "Error loading image"}
        </Text>

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
