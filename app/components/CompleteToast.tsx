import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface CompleteToastProps {
  isOpen: boolean;
  message: string;
}

const CompleteToast: React.FC<CompleteToastProps> = ({ isOpen, message }) => {
  return (
    <>
      {isOpen && (
        <View style={styles.overlay}>
          <View style={styles.centerToast}>
            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            <Text style={styles.toastText}>{message}</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // 半透明背景（不要なら削除OK）
    zIndex: 9999,
  },
  centerToast: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toastText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CompleteToast;
