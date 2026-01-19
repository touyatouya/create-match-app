import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  segmentItemActive: {
    backgroundColor: ColorPalette.dark.text,
    shadowColor: ColorPalette.cardShadow,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: FONT_SIZE.small,
    color: ColorPalette.filterItemName,
  },
  textActive: {
    color: ColorPalette.cardShadow,
    fontWeight: "600",
  },
});

export default SegmentButton;
