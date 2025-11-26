import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#10b981", // emerald-500
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  label: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
