import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  text: string;
  icon?: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text = "",
  icon,
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      disabled && { backgroundColor: ColorPalette.disabled },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    {icon}
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorPalette.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginVertical: 4,
    marginHorizontal: 16,
    ...globalStyles.touch,
    minHeight: 50,
    shadowColor: ColorPalette.blackText,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: ColorPalette.whiteText,
    marginLeft: 8,
    fontWeight: 600,
    fontSize: FONT_SIZE.body,
  },
});

export default PrimaryButton;
