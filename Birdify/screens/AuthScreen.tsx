import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { TextInputField } from "../components/ui/TextInputField";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { styles } from "./styles/AuthScreen"; 

export default function AuthScreen() {
  // -- Estados --
  const [identifier, setIdentifier] = useState(""); // Para Login (Usuario o Email)
  
  const [email, setEmail] = useState("");           // Solo para Registro
  const [username, setUsername] = useState("");     // Solo para Registro
  const [fullName, setFullName] = useState("");     // Solo para Registro
  
  const [password, setPassword] = useState("");     // Para ambos
  
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // ─── 1. LOGIN INTELIGENTE (Usuario o Correo) ─────────────────────────────
  const signIn = async () => {
    setLoading(true);
    let loginEmail = identifier.trim();

    // Si NO tiene @, es un nombre de usuario y buscamos email
    if (!loginEmail.includes("@")) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", loginEmail)
          .single();

        if (error || !data?.email) {
          Alert.alert("Error", "Usuario no encontrado");
          setLoading(false);
          return;
        }
        loginEmail = data.email;
      } catch (err) {
        Alert.alert("Error", "Error buscando usuario");
        setLoading(false);
        return;
      }
    }

    // Iniciar sesión con el email 
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (error) Alert.alert("Error de Login", error.message);
    setLoading(false);
  };

  // ─── 2. REGISTRO COMPLETO ──────────────────────────────────────────────
  const signUp = async () => {
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          // Estos datos se envían al Trigger para crear el perfil
          username: username.trim(), 
          full_name: fullName.trim(),
          display_name: username.trim(), 
        },
      },
    });

    if (error) {
      Alert.alert("Error de Registro", error.message);
    } else {
      Alert.alert("¡Cuenta Creada!", `Bienvenido, @${username}.`);
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!password) return Alert.alert("Falta contraseña");

    if (isLogin) {
      if (!identifier) return Alert.alert("Falta usuario", "Ingresa tu usuario o correo");
      signIn();
    } else {
      if (!email || !username || !fullName) {
        return Alert.alert("Faltan datos", "Por favor llena todos los campos");
      }
      signUp();
    }
  };

  // Limpiar campos al cambiar de modo
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIdentifier("");
    setEmail("");
    setPassword("");
    setUsername("");
    setFullName("");
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
          <Text style={styles.title}>Birdify</Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Bienvenido de nuevo" : "Únete a la comunidad"}
          </Text>
        </View>

        <View style={styles.form}>
          
          {/* VISTA DE LOGIN */}
          {isLogin && (
            <TextInputField
              label="Usuario o Correo"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="Ej: pajarito99 o hola@correo.com"
              autoCapitalize="none"
            />
          )}

          {/* VISTA DE REGISTRO */}
          {!isLogin && (
            <>
              <TextInputField
                label="Nombre Completo"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Juan Pérez"
                autoCapitalize="words"
              />
              <TextInputField
                label="Nombre de Usuario"
                value={username}
                onChangeText={setUsername}
                placeholder="juan_perez_99"
                autoCapitalize="none"
              />
              <TextInputField
                label="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="hola@correo.com"
              />
            </>
          )}

          {/* CONTRASEÑA */}
          <TextInputField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <PrimaryButton
            label={loading ? "Cargando..." : isLogin ? "Entrar" : "Crear Cuenta"}
            onPress={handleSubmit}
            disabled={loading}
            style={{ marginTop: 10 }}
          />

          <Pressable onPress={toggleMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia Sesión"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}