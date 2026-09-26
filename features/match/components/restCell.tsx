import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { getMatchCount } from "@/shared/logic/getMatchCount";
import { getMcOffset } from "@/shared/logic/getMcOffset";
import { globalStyles } from "@/styles/global";
import GenderIcon from "@/ui/GenderIcon";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Player } from "../../../types";
import { useSwapPlayer } from "../hooks/useSwapPlayer";

interface RestCellProps {
  player: Player;
}

const RestCell: React.FC<RestCellProps> = ({ player }) => {
  const { gameRounds, dispRound, swap, players } = useContext(AppContext);

  const { selectRestSwap } = useSwapPlayer();

  return (
    <TouchableOpacity
      key={player.id}
      style={[
        styles.restingPlayerItem,
        swap.player === player.id && styles.restingSwapPlayerItem,
      ]}
      onPress={() => selectRestSwap(player.id)}
      disabled={dispRound !== gameRounds.length}
    >
      <View style={styles.restingPlayerName}>
        <View style={{ flex: 4 }}>
          <Text
            style={[
              styles.restingPlayerText,
              swap.player === player.id && styles.restingSwapPlayerName,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {player.name}
          </Text>
        </View>
        {player.isRest && (
          <View style={{ flex: 1 }}>
            <Feather name="coffee" size={14} color={ColorPalette.blackText} />
          </View>
        )}
      </View>
      <View style={styles.subInfo}>
        <Text style={styles.getGameCount}>
          {getMatchCount(player.id, gameRounds) +
            getMcOffset(players, player.id)}
        </Text>
        <Text style={styles.playerGender}>
          <GenderIcon gender={player.gender} size={18} />
        </Text>
        {dispRound === gameRounds.length && (
          <Ionicons
            name="swap-horizontal"
            size={14}
            color={ColorPalette.secondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subInfo: {
    flex: 1.7,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  getGameCount: {
    flex: 1,
    fontSize: FONT_SIZE.tiny,
  },
  playerGender: {
    flex: 1,
  },
  restingPlayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ColorPalette.restPlayerBackground,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    ...globalStyles.touch,
  },
  restingSwapPlayerItem: {
    backgroundColor: ColorPalette.thirdry,
    borderColor: ColorPalette.secondary,
  },
  restingPlayerName: {
    flex: 3,
    marginLeft: 3,
    marginRight: 3,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  restingPlayerText: {
    fontSize: FONT_SIZE.small,
    color: ColorPalette.filterItemName,
  },
  restingSwapPlayerName: {
    flex: 4,
    color: ColorPalette.blackText,
  },
});

export default RestCell;
