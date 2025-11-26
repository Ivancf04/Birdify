// screens/DictionaryScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/DictionaryScreen.styles";

const API_URL =
  "https://nuthatch.lastelm.software/v2/birds?hasImg=true&page=1&pageSize=20";
// pon aquí tu API key real
const API_KEY = "93341d4d-2989-4b76-a42a-9eb125a47f52";

interface ApiBird {
  id: number | string;
  name: string;
  sciName: string;
  images: string[];

  description?: string;
  identification?: string;
  habitat?: string;
  diet?: string;
  size?: string;
  behavior?: string;
}

export default function DictionaryScreen() {
  const [birds, setBirds] = useState<ApiBird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const fetchBirds = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL, {
        headers: {
          "api-key": API_KEY,
        },
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const json = await res.json();
      const entities = json.entities || json;
      setBirds(entities);
    } catch (err: any) {
      console.log("Error fetching birds", err);
      setError("Could not load bird data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirds();
  }, []);

  const toggleExpanded = (id: string | number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const renderSection = (title: string, value?: string) => {
    if (!value) return null;
    return (
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>{title}</Text>
        <Text style={styles.detailSectionText}>{value}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: ApiBird }) => {
    const img = item.images && item.images.length > 0 ? item.images[0] : null;
    const isExpanded = expandedId === item.id;

    return (
      <View style={[styles.card, isExpanded && styles.cardExpanded]}>
        <View style={styles.cardHeaderRow}>
          {/* Imagen */}
          {img ? (
            <Image source={{ uri: img }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImageFallback}>
              <Feather name="image" size={20} color="#9ca3af" />
            </View>
          )}

          {/* Texto */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.sciName}</Text>
          </View>

          {/* Chevron que abre/cierra detalle */}
          <Pressable
            style={styles.cardIconContainer}
            onPress={() => toggleExpanded(item.id)}
          >
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#16a34a"
            />
          </Pressable>
        </View>

        {/* Detalle expandido dentro del mismo contenedor */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {renderSection("Description", item.description)}
            {renderSection("Identification", item.identification)}
            {renderSection("Habitat", item.habitat)}
            {renderSection("Diet", item.diet)}
            {renderSection("Size", item.size)}
            {renderSection("Behavior", item.behavior)}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Loading birds...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchBirds}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={birds}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
