import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
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
            <Ionicons
              name="checkmark-circle"
              size={40}
              color={ColorPalette.success}
            />
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
    backgroundColor: ColorPalette.transparent,
    zIndex: 9999,
  },
  centerToast: {
    backgroundColor: ColorPalette.background,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toastText: {
    marginTop: 12,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: ColorPalette.sectionTitie,
  },
});

export default CompleteToast;
