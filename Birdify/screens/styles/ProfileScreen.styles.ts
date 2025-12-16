import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  
  // Avatar
  avatarContainer: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: "center",
    position: "relative",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#d1fae5", // emerald-100
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#059669",
  },

  // Información Principal
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#064e3b",
    marginBottom: 4,
    textAlign: "center",
  },
  username: {
    fontSize: 16,
    color: "#059669",
    marginBottom: 32,
    fontWeight: "500",
  },

  // Tarjeta de Detalles
  infoCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0fdf4",
  },
  rowIcon: {
    marginRight: 16,
    width: 24, 
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "500",
  },
});