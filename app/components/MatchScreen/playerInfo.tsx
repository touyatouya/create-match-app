import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import GenderIcon from "../GenderIcon";
import { getPlayerName } from "./util";

interface PlayerInfoProps {
  playerId: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerId }) => {
  const { players } = useContext(AppContext);

  const getGender = (id: number) => {
    return players.find((player) => player.id === id)?.gender;
  };

  const getGameCount = (id: number) => {
    return players.find((player) => player.id === id)?.matchCount;
  };

  return (
    <View style={styles.playerInfo}>
      <Text style={styles.playerName}>{getPlayerName(playerId, players)}</Text>
      <View style={styles.subInfo}>
        <Text style={styles.getGameCount}>{getGameCount(playerId)}</Text>
        <Text style={styles.playerGender}>
          <GenderIcon gender={getGender(playerId)} />
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    display: "flex",
  },
  subInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
  },
  playerName: {
    flex: 2.7,
    fontSize: FONT_SIZE.heading,
    color: ColorPalette.blackText,
    fontWeight: "500",
    display: "flex",
  },
  getGameCount: {
    flex: 1.7,
    fontSize: FONT_SIZE.small,
  },
  playerGender: {
    flex: 1,
    marginRight: 4,
  },
});

export default PlayerInfo;
