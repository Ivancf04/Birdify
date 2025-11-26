import React from "react";
import { View, Text, ViewProps } from "react-native";
import { styles } from "./styles//Card.styles";

// 👇 Genérico para aceptar "style" como RN y mantener API compatible
type CardBaseProps = ViewProps & { children?: React.ReactNode };

export function Card({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardHeader({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardHeader, style]} {...rest}>
      {children}
    </View>
  );
}

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

export function CardAction({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardAction, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardContent({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardContent, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardFooter({ style, children, ...rest }: CardBaseProps) {
  return (
    <View style={[styles.cardFooter, style]} {...rest}>
      {children}
    </View>
  );
}
