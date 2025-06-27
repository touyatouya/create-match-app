// CustomCheckbox.tsx
import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label?: string;
  checked: boolean;
  onChange: () => void;
};

const Toggle: React.FC<Props> = ({ label = "", checked, onChange }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onChange}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.toggle, checked ? styles.toggleOn : styles.toggleOff]}
      >
        <View
          style={[
            styles.circle,
            checked ? styles.circleRight : styles.circleLeft,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    ...globalStyles.touch,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    marginRight: 10,
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: ColorPalette.secondary,
  },
  toggleOff: {
    backgroundColor: ColorPalette.muted,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ColorPalette.toggleCircle,
    position: "absolute",
    top: 3,
  },
  circleLeft: {
    left: 3,
  },
  circleRight: {
    right: 3,
  },
  label: {
    fontSize: FONT_SIZE.small,
  },
});

export default Toggle;
