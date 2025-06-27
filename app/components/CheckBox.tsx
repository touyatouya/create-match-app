import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label = "",
  checked,
  onChange,
}) => (
  <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
    <View style={[styles.checkbox, checked && styles.checked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    {label !== "" && <Text style={styles.label}>{label}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...globalStyles.touch,
  },
  checkbox: {
    minWidth: 24,
    minHeight: 24,
    borderWidth: 2,
    borderColor: ColorPalette.primary,
    backgroundColor: ColorPalette.background,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: ColorPalette.whiteIcon,
  },
  checkmark: {
    color: ColorPalette.primary,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    lineHeight: 20,
  },
  label: {
    fontSize: FONT_SIZE.body,
  },
});

export default Checkbox;
