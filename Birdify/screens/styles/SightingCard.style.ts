import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  species: {
    fontSize: 16,
    fontWeight: "700",
    color: "#064e3b",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#059669",
  },
  deleteButton: {
    padding: 6,
    borderRadius: 12,
  },
  deleteButtonPressed: {
    backgroundColor: "#fee2e2",
  },
  metaGrid: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#047857",
  },
  notesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#d1fae5",
  },
  notesText: {
    fontSize: 13,
    color: "#065f46",
  },
});
