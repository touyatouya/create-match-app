import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { StyleSheet } from "react-native";

export const playerScreenStyles = StyleSheet.create({
  row: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 8,
    borderBottomWidth: 1,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cellName: {
    flex: 2,
    paddingHorizontal: 4,
    fontSize: FONT_SIZE.subheading,
  },
  cellGender: {
    flex: 1,
    marginHorizontal: 4,
    fontSize: FONT_SIZE.small,
    flexDirection: "row",
  },
  cellMatch: {
    flex: 1,
    marginHorizontal: 4,
    textAlign: "center",
    fontSize: FONT_SIZE.small,
    flexDirection: "row",
    justifyContent: "center",
  },
  endIconButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...globalStyles.touch,
  },
});
