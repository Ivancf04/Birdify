import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f2f1",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#6ee7b7",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#064e3b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#047857",
    opacity: 0.8,
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleButton: {
    marginTop: 8,
    alignItems: "center",
  },
  toggleText: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "500",
  },
});