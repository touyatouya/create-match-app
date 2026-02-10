import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { getPlayerName } from "@/features/match/logic/utils";
import GenderIcon from "@/ui/GenderIcon";
import { Feather } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

interface PlayerInfoProps {
  playerId: number | null;
  showMatchCount: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  playerId,
  showMatchCount,
}) => {
  const { players } = useContext(AppContext);

  const getGender = (id: number) => {
    return players.find((player) => player.id === id)?.gender;
  };

  const getGameCount = (id: number) => {
    return players.find((player) => player.id === id)?.matchCount;
  };

  return (
    <View style={styles.playerInfo}>
      {playerId != null && (
        <View style={styles.playerName}>
          <Text
            style={styles.playerText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getPlayerName(playerId, players)}
          </Text>
          {players.find((player) => player.id === playerId)?.isRest && (
            <Feather name="coffee" size={17} color="black" />
          )}
        </View>
      )}

      {playerId != null && (
        <View style={styles.subInfo}>
          {showMatchCount && (
            <Text style={styles.getGameCount}>{getGameCount(playerId)}</Text>
          )}
          <Text style={styles.playerGender}>
            <GenderIcon gender={getGender(playerId)} size={18} />
          </Text>
        </View>
      )}
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
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
  playerText: {
    fontSize: FONT_SIZE.body,
    color: ColorPalette.blackText,
    fontWeight: "500",
  },
  getGameCount: {
    flex: 1.7,
    fontSize: FONT_SIZE.tiny,
  },
  playerGender: {
    flex: 1,
    marginRight: 4,
  },
});

export default PlayerInfo;
