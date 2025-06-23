import Colors from "@/constants/color";
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
    marginVertical: 8,
    ...globalStyles.touch,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checked: {
    // backgroundColor: Colors.accent,
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
  },
});

export default Checkbox;
