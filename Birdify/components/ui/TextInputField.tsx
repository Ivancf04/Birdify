import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { styles } from "./styles/TextInputField.styles";

interface TextInputFieldProps extends TextInputProps {
  label?: string;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  style,
  ...rest
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#9ca3af"
        {...rest}
      />
    </View>
  );
};
