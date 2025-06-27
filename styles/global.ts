import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  touch: {
    minWidth: 44,
    minHeight: 44,
  },
  headerLeft: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  headerRight: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  headerText: {
    fontSize: FONT_SIZE.subsubheading,
    color: ColorPalette.link,
  },
});
