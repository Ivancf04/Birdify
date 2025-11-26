import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  listContainer: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 4,
  },
  commentItem: {
    paddingVertical: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "600",
    color: "#047857",
  },
  commentText: {
    fontSize: 12,
    color: "#065f46",
  },
  form: {
    marginTop: 4,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    // se mezcla con estilos base del input
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
