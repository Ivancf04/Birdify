import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: "#065f46",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#047857",
  },
  notesSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d1fae5",
  },
  notesText: {
    fontSize: 13,
    color: "#065f46",
  },
  footerRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d1fae5",
    paddingTop: 8,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#059669",
  },
  commentButtonText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  commentsWrapper: {
    marginTop: 10,
  },
});
