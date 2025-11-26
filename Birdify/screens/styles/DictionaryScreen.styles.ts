// screens/styles/DictionaryScreen.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "transparent",
  },

  listContent: {
  },

  /* --- card / item --- */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,

    elevation: 2,
  },
  cardExpanded: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    resizeMode: "cover",
  },
  cardImageFallback: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#022c22",
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontStyle: "italic",
    color: "#16a34a",
  },
  cardIconContainer: {
    marginLeft: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  /* --- contenido expandido --- */
  expandedContent: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#bbf7d0",
    paddingTop: 10,
  },
  detailSection: {
    marginBottom: 8,
  },
  detailSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065f46",
    marginBottom: 2,
  },
  detailSectionText: {
    fontSize: 13,
    color: "#064e3b",
  },

  /* --- loading / error --- */
  loadingContainer: {
    flex: 1,
    backgroundColor: "#e0f2f1",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: "#047857",
  },
  errorText: {
    fontSize: 13,
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#059669",
  },
  retryText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});
