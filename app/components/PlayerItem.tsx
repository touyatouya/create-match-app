import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { Player } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PlayerItemProps {
  item: Player;
  onPress: () => void;
  isSelected: boolean;
  selectedText: string;
}

const PlayerItem: React.FC<PlayerItemProps> = ({
  item,
  onPress,
  isSelected,
  selectedText,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[globalStyles.playerItem, isSelected && styles.selectedPlayerItem]}
  >
    <Text style={[styles.playerName, isSelected && styles.selectedPlayerName]}>
      {item.name}
    </Text>
    {isSelected && (
      <View style={styles.selectedBadge}>
        <Text style={styles.selectedText}>{selectedText}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  playerName: {
    flex: 2,
    paddingHorizontal: 4,
    fontSize: FONT_SIZE.title,
  },
  selectedPlayerItem: {
    backgroundColor: ColorPalette.secondary,
    paddingLeft: 14,
    paddingRight: 14,
  },
  selectedPlayerName: {
    color: ColorPalette.whiteText,
  },
  selectedBadge: {
    flexDirection: "row",
    backgroundColor: ColorPalette.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  selectedText: {
    color: ColorPalette.whiteText,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
  },
});

export default PlayerItem;
