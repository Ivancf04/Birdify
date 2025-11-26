import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  fallbackContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#f3f4f6", // gray-100
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  fallbackText: {
    color: "#6b7280", // gray-500
    fontSize: 12,
    marginBottom: 8,
  },

  fallbackIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#e5e7eb", // gray-200
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 28,
  },
});
