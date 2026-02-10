import ColorPalette from "@/constants/color";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loading: React.FC = () => (
  <View style={styles.overlay} pointerEvents="auto">
    <ActivityIndicator size="large" color={ColorPalette.whiteIcon} />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: ColorPalette.transparent,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
