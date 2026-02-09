import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { GenerateMode } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { default as PlayerInfo } from "./playerInfo";

interface MatchPlayerProps {
  matchId: number;
  swapPlayer: number | null;
  playerId: number;
  selectSwapPlayer: (
    matchId: number,
    playerId: number,
    partnerId: number,
  ) => void;
  partnerId: number;
  isSwap: boolean;
  showMatchCount: boolean;
  isFinished: boolean;
}

const MatchPlayer: React.FC<MatchPlayerProps> = ({
  matchId,
  swapPlayer,
  playerId,
  selectSwapPlayer,
  partnerId,
  isSwap,
  showMatchCount,
  isFinished,
}) => {
  const { generateMode } = React.useContext(AppContext);
  return (
    <>
      {isSwap ? (
        <TouchableOpacity
          key={playerId}
          style={[
            styles.playerButton,
            swapPlayer === playerId && styles.swapPlayerButton,
          ]}
          onPress={async () => {
            !isFinished && selectSwapPlayer(matchId, playerId, partnerId);

            await analytics().logEvent("swap_player");
          }}
        >
          <PlayerInfo playerId={playerId} showMatchCount={showMatchCount} />
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
            generateMode === GenerateMode.FILL_ENPTY &&
              isFinished && { opacity: 0.5 },
          ]}
        >
          <PlayerInfo playerId={playerId} showMatchCount={showMatchCount} />
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
