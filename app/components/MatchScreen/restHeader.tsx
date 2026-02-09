import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { Feather } from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GenerateMode } from "../../../types";

const RestHeader: React.FC = () => {
  const { players, gameRounds, generateMode, dispRound } =
    useContext(AppContext);

  const playablePlayers = players.filter((player) => {
    if (generateMode === GenerateMode.REPLACE_ALL) {
      return gameRounds[dispRound - 1]?.matches.some((match) => {
        return (
          match.teamA.some((playerId) => playerId === player.id) ||
          match.teamB.some((playerId) => playerId === player.id)
        );
      });
    } else {
      return gameRounds
        .flatMap((gameRound) => gameRound.matches)
        .filter((match) => !match.isFinished || !match.canInsertNext)
        .some((match) => {
          return (
            match.teamA.some((playerId) => playerId === player.id) ||
            match.teamB.some((playerId) => playerId === player.id)
          );
        });
    }
  });

  const playablePlayerIds = new Set(playablePlayers.map((p) => p.id));

  const restPlayers = players.filter(
    (player) => player.isJoin && !playablePlayerIds.has(player.id),
  );

  return (
    <View style={styles.restingHeader}>
      <View style={styles.restingTitle}>
        <Feather name="coffee" size={20} color={ColorPalette.blackText} />
        <Text style={styles.restingSectionTitle}>休憩中のプレイヤー</Text>
      </View>
      <Text style={styles.restingCount}>{restPlayers.length}人</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  restingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    backgroundColor: ColorPalette.pageBackground,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
    marginLeft: 6,
  },
  restingCount: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "600",
  },
});

export default RestHeader;
