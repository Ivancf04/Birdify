import { StyleSheet, Platform, StatusBar } from "react-native";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 40 : StatusBar.currentHeight || 0;

export const styles = StyleSheet.create({
  header: {
    backgroundColor: "#009966",
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    height: 44, 
  },
  
  // Contenedor del Título 
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Botones Laterales
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});