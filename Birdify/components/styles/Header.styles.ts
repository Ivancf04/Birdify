import { StyleSheet, Platform, StatusBar } from "react-native";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 40 : StatusBar.currentHeight || 0;

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#009966",
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#d1fae5",
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },
  signOutButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
});