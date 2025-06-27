import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Gender } from "@/types";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getPlayerName } from "./util";

interface MatchPlayerProps {
  swapPlayer: number | null;
  playerId: number;
  selectSwapPlayer: (id: number) => void;
  partnerId: number | undefined;
  isEdit: boolean;
}

const MatchPlayer: React.FC<MatchPlayerProps> = ({
  swapPlayer,
  playerId,
  selectSwapPlayer,
  partnerId,
  isEdit,
}) => {
  const { players } = useContext(AppContext);

  const getGender = (id: number) => {
    return players.find((player) => player.id === id)?.gender;
  };

  const playerInfo = () => {
    return (
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {getPlayerName(playerId, players)}
        </Text>
        <Text style={styles.playerGender}>
          {getGender(playerId) === Gender.男性 ? (
            <Foundation name="male" size={24} color={ColorPalette.men} />
          ) : getGender(playerId) === Gender.女性 ? (
            <Foundation name="female" size={24} color={ColorPalette.women} />
          ) : (
            ""
          )}
        </Text>
      </View>
    );
  };

  return (
    <>
      {isEdit ? (
        <TouchableOpacity
          key={playerId}
          style={[
            styles.playerButton,
            isEdit && swapPlayer === playerId && styles.swapPlayerButton,
          ]}
          onPress={() => {
            isEdit && swapPlayer !== partnerId && selectSwapPlayer(playerId);
          }}
        >
          {playerInfo()}
          {isEdit && (
            <Ionicons
              name="swap-horizontal"
              size={18}
              color={ColorPalette.secondary}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View key={playerId} style={styles.playerButton}>
          {playerInfo()}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  playerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ColorPalette.background,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    ...globalStyles.touch,
  },
  swapPlayerButton: {
    backgroundColor: ColorPalette.thirdry,
    borderColor: ColorPalette.secondary,
  },
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

export default MatchPlayer;
