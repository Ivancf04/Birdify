import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: "#d1fae5",
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#065f46",
    fontWeight: "500",
  },
  listWrapper: {
    marginBottom: 8,
  },
  commentCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065f46",
  },
  commentTime: {
    fontSize: 11,
    color: "#16a34a",
  },
  commentText: {
    fontSize: 12,
    color: "#065f46",
  },
  form: {
    marginTop: 4,
    gap: 6,
  },
  input: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#6ee7b7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: "#022c22",
    backgroundColor: "#ecfdf5",
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
});
