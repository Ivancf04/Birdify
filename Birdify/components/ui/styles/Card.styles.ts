import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200 aproximado
    paddingVertical: 0,
    paddingHorizontal: 0,
    flexDirection: "column",
    gap: 24, // gap-6 equivalente
    overflow: "hidden",

    // sombras
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  cardHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 6,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
  },

  cardAction: {
    position: "absolute",
    right: 24,
    top: 24,
  },

  cardContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  cardFooter: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },
});
