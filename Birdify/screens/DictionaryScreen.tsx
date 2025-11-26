import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles/DictionaryScreen.styles";

interface ApiBird {
  id: number;
  commonName: string;
  sciName: string;
  imageUrl?: string;

  wikipediaUrl?: string;
  observationsCount?: number;
  establishmentMeans?: string; // native / introduced
  establishmentPlace?: string; // Mexico
  rank?: string; // species
  iconicTaxonName?: string; // Aves
}

const API_URL =
  "https://api.inaturalist.org/v1/taxa?q=bird&taxon_id=3&place_id=6793&rank=species&per_page=40";

export default function DictionaryScreen() {
  const [birds, setBirds] = useState<ApiBird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchBirds = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const json = await res.json();
      const results = json.results ?? [];

      const parsed: ApiBird[] = results.map((t: any) => ({
        id: t.id,
        commonName: t.preferred_common_name || t.name || "Unknown",
        sciName: t.name || "",
        imageUrl: t.default_photo?.medium_url || t.default_photo?.square_url,

        wikipediaUrl: t.wikipedia_url || undefined,
        observationsCount: t.observations_count,
        establishmentMeans:
          t.preferred_establishment_means ||
          t.establishment_means?.establishment_means,
        establishmentPlace: t.establishment_means?.place?.name,
        rank: t.rank,
        iconicTaxonName: t.iconic_taxon_name,
      }));

      setBirds(parsed);
    } catch (err: any) {
      console.log("Error fetching birds from iNaturalist", err);
      setError("Could not load bird data from iNaturalist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirds();
  }, []);

  const toggleExpanded = (id: number) => {
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
    const isExpanded = expandedId === item.id;

    return (
      <View style={[styles.card, isExpanded && styles.cardExpanded]}>
        {/* Header compacto */}
        <View style={styles.cardHeaderRow}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImageFallback}>
              <Feather name="image" size={20} color="#9ca3af" />
            </View>
          )}

          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.commonName}</Text>
            {!!item.sciName && (
              <Text style={styles.cardSubtitle}>{item.sciName}</Text>
            )}
          </View>

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

        {/* Contenido expandido dentro del mismo contenedor */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Status en México */}
            {(item.establishmentMeans || item.establishmentPlace) && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Status in Mexico</Text>
                <Text style={styles.detailSectionText}>
                  {item.establishmentMeans
                    ? item.establishmentMeans.charAt(0).toUpperCase() +
                      item.establishmentMeans.slice(1)
                    : "Unknown"}
                  {item.establishmentPlace
                    ? ` in ${item.establishmentPlace}`
                    : ""}
                </Text>
              </View>
            )}

            {/* Taxonomía básica */}
            {(item.rank || item.iconicTaxonName) && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Taxonomy</Text>
                <Text style={styles.detailSectionText}>
                  {item.rank
                    ? item.rank.charAt(0).toUpperCase() + item.rank.slice(1)
                    : ""}
                  {item.iconicTaxonName
                    ? ` · ${item.iconicTaxonName}`
                    : ""}
                </Text>
              </View>
            )}

            {/* Observaciones */}
            {typeof item.observationsCount === "number" && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Observations</Text>
                <Text style={styles.detailSectionText}>
                  {item.observationsCount.toLocaleString()} observations on
                  iNaturalist
                </Text>
              </View>
            )}

            {/* Link a Wikipedia */}
            {item.wikipediaUrl && (
              <Pressable
                style={styles.detailLinkRow}
                onPress={() => Linking.openURL(item.wikipediaUrl!)}
              >
                <Feather
                  name="external-link"
                  size={14}
                  color="#059669"
                />
                <Text style={styles.detailLinkText}>
                  Open Wikipedia article
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>
          Loading birds from iNaturalist...
        </Text>
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
