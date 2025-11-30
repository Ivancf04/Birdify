import React, { useState } from "react";
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Pressable } from "react-native";
import { supabase } from "../lib/supabase";
import { TextInputField } from "../components/ui/TextInputField";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { styles } from "./styles/AuthScreen";
import { Feather } from "@expo/vector-icons";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Alternar entre Login y Registro

  // 1. Iniciar Sesión
  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  };

  // 2. Registrarse
  const signUpWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("¡Verifica tu correo!", "Te hemos enviado un link para confirmar tu cuenta.");
      // Opcional: Si desactivaste "Confirm Email" en Supabase, entra directo.
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert("Faltan datos", "Por favor ingresa email y contraseña");
      return;
    }
    if (isLogin) {
      signInWithEmail();
    } else {
      signUpWithEmail();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Feather name="feather" size={40} color="#059669" />
          </View>
          <Text style={styles.title}>Welcome to Birdify</Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Sign in to continue" : "Create an account to start"}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="bird@lover.com"
          />
          
          <TextInputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <PrimaryButton
            label={loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            onPress={handleSubmit}
            disabled={loading}
            style={{ marginTop: 10 }}
          />

          <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}