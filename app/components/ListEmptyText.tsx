import ColorPalette from "@/constants/color";
import React from "react";
import { StyleSheet, Text } from "react-native";

interface ListEmptyTextProps {
  message: string;
}

const ListEmptyText: React.FC<ListEmptyTextProps> = ({ message }) => {
  return <Text style={styles.emptyText}>{message}</Text>;
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: ColorPalette.emptyText,
    marginTop: 20,
  },
});

export default ListEmptyText;
