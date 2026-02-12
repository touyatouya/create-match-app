import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { GenerateMode } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSwapPlayer } from "../hooks/useSwapPlayer";
import { default as PlayerInfo } from "./playerInfo";

interface MatchPlayerProps {
  matchId: number;
  playerId: number;
  partnerId: number;
  canSwap: boolean;
  isFinished: boolean;
}

const MatchPlayer: React.FC<MatchPlayerProps> = ({
  matchId,
  playerId,
  partnerId,
  canSwap,
  isFinished,
}) => {
  const { swap, generateMode } = React.useContext(AppContext);
  const { selectSwapPlayer } = useSwapPlayer();

  return (
    <>
      {canSwap ? (
        <TouchableOpacity
          key={playerId}
          style={[
            styles.playerButton,
            swap.player === playerId && styles.swapPlayerButton,
          ]}
          onPress={async () => {
            !isFinished && selectSwapPlayer(matchId, playerId, partnerId);

            await analytics().logEvent("swap_player");
          }}
        >
          <PlayerInfo playerId={playerId} />
          <Ionicons
            name="swap-horizontal"
            size={14}
            color={ColorPalette.secondary}
          />
        </TouchableOpacity>
      ) : (
        <View
          key={playerId}
          style={[
            styles.playerButton,
            generateMode === GenerateMode.FILL_EMPTY &&
              isFinished && { opacity: 0.5 },
          ]}
        >
          <PlayerInfo playerId={playerId} />
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
    paddingHorizontal: 8,
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
});

export default MatchPlayer;
