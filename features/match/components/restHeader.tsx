import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { Feather } from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getPlayingPlayers } from "../logic/getPlayingPlayers";
import { getRestingPlayers } from "../logic/getRestingPlayers";

const RestHeader: React.FC = () => {
  const { players, gameRounds, generateMode, dispRound } =
    useContext(AppContext);

  const playingPlayers = getPlayingPlayers(
    players,
    gameRounds,
    generateMode,
    dispRound,
  );

  const restPlayers = getRestingPlayers(players, playingPlayers);

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
