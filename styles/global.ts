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
  },
  headerRight: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: FONT_SIZE.subsubheading,
    color: ColorPalette.link,
  },
  playerItem: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
  },
});
