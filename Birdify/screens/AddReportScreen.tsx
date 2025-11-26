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

import { styles } from "./styles/AddReportScreen.styles";
import type { BirdSighting } from "../App";

interface AddReportScreenProps {
  onSubmit: (sighting: Omit<BirdSighting, "id" | "comments">) => void;
}

export default function AddReportScreen({ onSubmit }: AddReportScreenProps) {
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [species, setSpecies] = useState("");
  const [locationText, setLocationText] = useState("");
  const [count, setCount] = useState("1");
  const [notes, setNotes] = useState("");

  // LOCATION
  const [locationLoading, setLocationLoading] = useState(false);

  // CAMERA
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef<any>(null);

  const CameraViewAny: any = CameraView;


  // ─── LOCATION: pedir permiso y prellenar ────────────────────────────
  useEffect(() => {
    const askLocation = async () => {
      if (!Device.isDevice) {
        console.log("Location not available on simulator");
        return;
      }

      setLocationLoading(true);
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
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
          const label = [
            g.name,
            g.street,
            g.city,
            g.region,
            g.country,
          ]
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

  // ─── CAMERA: abrir, pedir permiso, tomar foto ───────────────────────
  const handleOpenCamera = async () => {
    if (!cameraPermission || !cameraPermission.granted) {
      const { status } = await requestCameraPermission();
      if (status !== "granted") {
        Alert.alert(
          "Camera permission",
          "Camera permission is required to take a bird photo."
        );
        return;
      }
    }
    setIsCameraOpen(true);
  };

  const handleTakePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      // @ts-ignore: expo-camera CameraView typings
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        setImageUri(photo.uri);
      }
      setIsCameraOpen(false);
    } catch (err) {
      console.log("Camera error", err);
      Alert.alert("Camera", "Could not take picture.");
    }
  };

  const handleCancelCamera = () => {
    setIsCameraOpen(false);
  };

  // ─── SUBMIT ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // 1. Validaciones
    if (!locationText.trim()) {
      Alert.alert("Falta ubicación", "Por favor indica dónde viste el ave.");
      return;
    }
    if (!imageUri) {
      Alert.alert("Falta foto", "Es necesario tomar una foto.");
      return;
    }

    // 2. Preparar los datos (FormData es obligatorio para enviar archivos)
    const formData = new FormData();
    formData.append('species', species.trim() || "Unknown");
    formData.append('location', locationText.trim());
    formData.append('count', count);
    formData.append('notes', notes.trim());
    
    // Fechas automáticas
    const now = new Date();
    formData.append('date', now.toISOString().slice(0, 10));
    formData.append('time', now.toTimeString().slice(0, 5));

    // 3. Preparar la imagen para subir
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    // @ts-ignore: TypeScript a veces se queja del formato de archivo en React Native, lo ignoramos.
    formData.append('photo', {
      uri: imageUri,
      name: filename || 'photo.jpg',
      type,
    } as any);

    try {
      // 4. ENVIAR A TU SERVIDOR XAMPP
      // Nota: headers se deja vacío o sin Content-Type manual para que fetch lo calcule solo.
      const response = await fetch('http://192.168.1.64/birdify/api.php?action=add_sighting', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("¡Éxito!", "Avistamiento guardado en la base de datos.");
        
        // Llamamos a onSubmit para avisar a App.tsx que refresque la lista
        onSubmit({
          species: species.trim() || "Unknown",
          location: locationText.trim(),
          date: now.toISOString().slice(0, 10),
          time: now.toTimeString().slice(0, 5),
          count: Number(count) || 1,
          notes: notes.trim(),
          image: imageUri,
        });

        // Limpiar el formulario
        setSpecies("");
        setNotes("");
        setCount("1");
        setLocationText("");
        setImageUri(undefined);
      } else {
        Alert.alert("Error del Servidor", result.error || "No se pudo guardar.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error de Conexión", "No se pudo conectar con 192.168.1.64. Verifica que tu PC y Celular estén en el mismo Wifi.");
    }
  };

  return (
    <>
      {/* MODAL CÁMARA */}
      <Modal visible={isCameraOpen} animationType="slide">
        <View style={styles.cameraScreen}>
          <CameraViewAny
            ref={cameraRef}
            style={styles.camera}
            facing="back"
          />
          <View style={styles.cameraControls}>
            <Pressable
              style={[styles.cameraButton, styles.cameraCancel]}
              onPress={handleCancelCamera}
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

      {/* FORMULARIO */}
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Bird Photo */}
            <Text style={styles.label}>Bird Photo *</Text>

            <Pressable style={styles.photoBox} onPress={handleOpenCamera}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.photoPreview}
                />
              ) : (
                <>
                  <Feather name="upload-cloud" size={32} color="#059669" />
                  <Text style={styles.photoText}>
                    Tap to take a bird photo
                  </Text>
                  <Text style={styles.photoSubText}>Using device camera</Text>
                </>
              )}
            </Pressable>

            {/* Species */}
            <Text style={styles.label}>Bird Species (if known)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={species}
                onChangeText={setSpecies}
                placeholder="e.g., American Robin or 'Unknown'"
                placeholderTextColor="#6ee7b7"
                style={styles.input}
              />
            </View>

            {/* Location */}
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <Feather name="map-pin" size={16} color="#059669" />
              <TextInput
                value={locationText}
                onChangeText={setLocationText}
                placeholder={
                  locationLoading
                    ? "Getting current location..."
                    : "e.g., Central Park, New York"
                }
                placeholderTextColor="#6ee7b7"
                style={styles.inputIcon}
              />
            </View>

            {/* Number of birds */}
            <Text style={styles.label}>Number of Birds</Text>
            <View style={styles.inputWithIcon}>
              <Feather name="hash" size={16} color="#059669" />
              <TextInput
                value={count}
                onChangeText={setCount}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor="#6ee7b7"
                style={styles.inputIcon}
              />
            </View>

            {/* Notes */}
            <Text style={styles.label}>Notes / Description</Text>
            <View style={styles.notesWrapper}>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Describe the bird's appearance, behavior, or any other details..."
                placeholderTextColor="#6ee7b7"
                multiline
                textAlignVertical="top"
                style={styles.notesInput}
              />
            </View>

            {/* Submit */}
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Report Sighting</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
