import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  text: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text = "",
  icon,
  onPress,
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
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
    borderRadius: 8,
    marginBottom: 8,
    ...globalStyles.touch,
  },
  buttonText: {
    color: ColorPalette.whiteText,
    marginLeft: 8,
    fontWeight: 600,
    fontSize: FONT_SIZE.body,
  },
});

export default PrimaryButton;
