import Colors from "@/constants/color";
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
    backgroundColor: Colors.toggleBackground,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.borderline,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  selectedButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.sectionTitie,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 5,
    backgroundColor: Colors.muted,
    alignSelf: "flex-start",
  },
  selectedText: {
    fontWeight: "bold",
    color: Colors.whiteText,
  },
});

export default GenderToggle;
