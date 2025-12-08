import React from "react";
import { View, Text, ViewProps } from "react-native";
import { styles } from "./styles//Card.styles";

// Props base para las tarjetas, permite estilos y children
type CardBaseProps = ViewProps & { children?: React.ReactNode };

// Contenedor principal de tarjeta
export function Card({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

// Encabezado
export function CardHeader({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardHeader, style]} {...rest}>
      {children}
    </View>
  );
}

// Titulo
export function CardTitle({
  style,
  children,
  ...rest
}: CardBaseProps & { children: React.ReactNode }) {
  return (
    <Text style={[styles.cardTitle, style]} {...rest}>
      {children}
    </Text>
  );
}

// Descripcion
export function CardDescription({
  style,
  children,
  ...rest
}: CardBaseProps & { children: React.ReactNode }) {
  return (
    <Text style={[styles.cardDescription, style]} {...rest}>
      {children}
    </Text>
  );
}

// Acciones y botones
export function CardAction({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardAction, style]} {...rest}>
      {children}
    </View>
  );
}

// Contenido de la tarjeta
export function CardContent({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardContent, style]} {...rest}>
      {children}
    </View>
  );
}

// Pie de la tarjeta
export function CardFooter({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardFooter, style]} {...rest}>
      {children}
    </View>
  );
}
