import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { Gender } from "@/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GenderToggleType {
  value: Gender;
  setGender: (gender: Gender) => void;
}

const GenderToggle: React.FC<GenderToggleType> = ({ value, setGender }) => {
  return (
    <View style={styles.toggleContainer}>
      {Object.values(Gender).map((gender) => (
        <TouchableOpacity
          key={gender}
          style={[styles.button, value === gender && styles.selectedButton]}
          onPress={() => setGender(gender)}
        >
          <Text
            style={[styles.buttonText, value === gender && styles.selectedText]}
          >
            {gender}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: ColorPalette.toggleBackground,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  selectedButton: {
    backgroundColor: ColorPalette.secondary,
  },
  buttonText: {
    fontSize: FONT_SIZE.body,
    color: ColorPalette.sectionTitie,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 5,
    backgroundColor: ColorPalette.muted,
    alignSelf: "flex-start",
    ...globalStyles.touch,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedText: {
    fontWeight: "bold",
    color: ColorPalette.whiteText,
  },
});

export default GenderToggle;
