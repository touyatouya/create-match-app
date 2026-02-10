import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { StyleSheet } from "react-native";

export const MarchScreenStyles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: ColorPalette.emptyText,
  },
  detailSettingSection: {
    backgroundColor: ColorPalette.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    width: "100%",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
  },
  subSectionText: {
    fontSize: FONT_SIZE.small,
    fontWeight: 500,
    color: ColorPalette.sectionTitle,
    marginBottom: 8,
  },
  settingTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    columnGap: 4,
  },
  settingPlayerNameText: {
    marginLeft: 6,
    fontSize: FONT_SIZE.small,
    color: ColorPalette.filterItemName,
    marginRight: 5,
  },
});
