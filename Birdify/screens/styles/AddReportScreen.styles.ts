import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e0f2f1", // mismo fondo que Home
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#ecfdf5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065f46",
    marginBottom: 6,
    marginTop: 10,
  },

  // PHOTO
  photoBox: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#6ee7b7",
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
  },
  photoText: {
    marginTop: 8,
    fontSize: 13,
    color: "#059669",
    fontWeight: "500",
  },
  photoSubText: {
    marginTop: 4,
    fontSize: 11,
    color: "#10b981",
  },
  photoPreview: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    resizeMode: "cover",
  },

  // INPUTS
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6ee7b7",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    fontSize: 13,
    color: "#022c22",
    paddingVertical: 4,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6ee7b7",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    columnGap: 6,
  },
  inputIcon: {
    flex: 1,
    fontSize: 13,
    color: "#022c22",
    paddingVertical: 4,
  },
  notesWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6ee7b7",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 0,
    minHeight: 120,
  },
  notesInput: {
    flex: 1,
    fontSize: 13,
    margin: 0,
    color: "#022c22",
    textAlignVertical: "top", 
  },

  // SUBMIT
  submitButton: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#059669",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  // CAMERA MODAL
  cameraScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  cameraButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  cameraCancel: {
    backgroundColor: "rgba(15,23,42,0.8)",
  },
  cameraCapture: {
    backgroundColor: "#059669",
  },
  cameraButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
