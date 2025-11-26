import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { CameraView, useCameraPermissions } from "expo-camera";

import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

import { styles } from "./styles/AddReportScreen.styles";
import type { BirdSighting } from "../App";
import { supabase } from "../lib/supabase";

interface AddReportScreenProps {
  onSubmit: (sighting: Omit<BirdSighting, "id" | "comments">) => void;
}

export default function AddReportScreen({ onSubmit }: AddReportScreenProps) {
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [species, setSpecies] = useState("");
  const [locationText, setLocationText] = useState("");
  const [count, setCount] = useState("1");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef<any>(null);
  const CameraViewAny: any = CameraView;

  // ─── LOCATION ────────────────────────────────────────────────────────
  useEffect(() => {
    const askLocation = async () => {
      if (!Device.isDevice) return;
      setLocationLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geocode.length > 0) {
          const g = geocode[0];
          const label = [g.name, g.street, g.city, g.region, g.country]
            .filter(Boolean)
            .join(", ");
          setLocationText(label);
        }
      } catch (err) {
        console.log("Location error", err);
      } finally {
        setLocationLoading(false);
      }
    };
    askLocation();
  }, []);

  // ─── CAMERA ──────────────────────────────────────────────────────────
  const handleOpenCamera = async () => {
    if (!cameraPermission || !cameraPermission.granted) {
      const { status } = await requestCameraPermission();
      if (status !== "granted") {
        Alert.alert("Permiso", "Se requiere cámara.");
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const handleTakePhoto = async () => {
    try {
      if (!cameraRef.current) return;
      // @ts-ignore
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (photo?.uri) {
        setImageUri(photo.uri);
      }
      setIsCameraOpen(false);
    } catch (err) {
      Alert.alert("Error", "No se pudo tomar la foto.");
    }
  };

  // ─── SUBMIT A SUPABASE ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!locationText.trim()) {
      Alert.alert("Falta ubicación", "Indica dónde viste el ave.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Falta foto", "Es necesario tomar una foto.");
      return;
    }

    setLoading(true);

    try {
      // 1. LEER COMO BASE64 USANDO LA API LEGACY
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64",
      });

      const fileName = `${Date.now()}.jpg`;

      // 2. SUBIR
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      // 3. GUARDAR DATOS
      const { error: insertError } = await supabase
        .from("sightings")
        .insert({
          species: species.trim() || "Unknown",
          location: locationText.trim(),
          count: Number(count) || 1,
          notes: notes.trim(),
          sighting_date: new Date().toISOString().slice(0, 10),
          sighting_time: new Date().toTimeString().slice(0, 5),
          image_path: fileName,
        });

      if (insertError) throw insertError;

      Alert.alert("¡Éxito!", "Reporte guardado en la nube ☁️");
      
      setSpecies("");
      setNotes("");
      setCount("1");
      setLocationText("");
      setImageUri(undefined);
      
      onSubmit({} as any); 

    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal visible={isCameraOpen} animationType="slide">
        <View style={styles.cameraScreen}>
          <CameraViewAny ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.cameraControls}>
            <Pressable
              style={[styles.cameraButton, styles.cameraCancel]}
              onPress={() => setIsCameraOpen(false)}
            >
              <Text style={styles.cameraButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.cameraButton, styles.cameraCapture]}
              onPress={handleTakePhoto}
            >
              <Feather name="camera" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.label}>Bird Photo *</Text>
            <Pressable style={styles.photoBox} onPress={handleOpenCamera}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.photoPreview} />
              ) : (
                <>
                  <Feather name="upload-cloud" size={32} color="#059669" />
                  <Text style={styles.photoText}>Tap to take photo</Text>
                </>
              )}
            </Pressable>

            <Text style={styles.label}>Bird Species</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={species}
                onChangeText={setSpecies}
                placeholder="e.g. Robin"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <Feather name="map-pin" size={16} color="#059669" />
              <TextInput
                value={locationText}
                onChangeText={setLocationText}
                placeholder={locationLoading ? "Locating..." : "City, Country"}
                style={styles.inputIcon}
              />
            </View>

            <Text style={styles.label}>Count</Text>
            <View style={styles.inputWithIcon}>
              <Feather name="hash" size={16} color="#059669" />
              <TextInput
                value={count}
                onChangeText={setCount}
                keyboardType="number-pad"
                style={styles.inputIcon}
              />
            </View>

            <Text style={styles.label}>Notes</Text>
            <View style={styles.notesWrapper}>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                style={styles.notesInput}
              />
            </View>

            <Pressable
              style={[styles.submitButton, loading && { opacity: 0.5 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? "Uploading..." : "Report Sighting"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}