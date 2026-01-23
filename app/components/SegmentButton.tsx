import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface PrimaryButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const SegmentButton: React.FC<PrimaryButtonProps> = ({
  label = "",
  active = false,
  onPress,
}) => (
  <Pressable
    style={[styles.segmentItem, active && styles.segmentItemActive]}
    onPress={onPress}
  >
    <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  segmentItem: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexBasis: 0,
    ...globalStyles.touch,
    minHeight: 38,
  },
  segmentItemActive: {
    backgroundColor: ColorPalette.checked,
    shadowColor: ColorPalette.cardShadow,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: FONT_SIZE.tiny,
    color: ColorPalette.checked,
  },
  textActive: {
    color: ColorPalette.whiteIcon,
    fontWeight: "600",
  },
});

export default SegmentButton;
