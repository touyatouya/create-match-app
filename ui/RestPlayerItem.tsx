import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Player } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RemoveButton from "./RemoveButton";

interface RestPlayerItemProps {
  item: Player;
  onPressRemoveButton: () => void;
}

const RestPlayerItem: React.FC<RestPlayerItemProps> = ({
  item,
  onPressRemoveButton,
}) => {
  const { players } = React.useContext(AppContext);

  return (
    <View
      style={[
        globalStyles.playerItem,
        { paddingTop: 6, paddingBottom: 6, justifyContent: "space-between" },
      ]}
    >
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {players.find((player) => player.id === item.id)?.name}
        </Text>
      </View>
      <RemoveButton onPress={onPressRemoveButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  playerName: {
    fontSize: FONT_SIZE.title,
  },
});

export default RestPlayerItem;
