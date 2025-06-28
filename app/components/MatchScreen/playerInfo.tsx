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

  return (
    <View style={styles.playerInfo}>
      <Text style={styles.playerName}>{getPlayerName(playerId, players)}</Text>
      <Text style={styles.playerGender}>
        <GenderIcon gender={getGender(playerId)} />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  playerName: {
    fontSize: FONT_SIZE.heading,
    color: ColorPalette.blackText,
    fontWeight: "500",
  },
  playerGender: {
    marginRight: 8,
  },
});

export default PlayerInfo;
