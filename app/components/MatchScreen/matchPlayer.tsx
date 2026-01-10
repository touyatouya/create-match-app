import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { default as PlayerInfo } from "./playerInfo";

interface MatchPlayerProps {
  swapPlayer: number | null;
  playerId: number;
  selectSwapPlayer: (id: number, partnerId?: number | null) => void;
  partnerId: number | undefined;
  isSwap: boolean;
}

const MatchPlayer: React.FC<MatchPlayerProps> = ({
  swapPlayer,
  playerId,
  selectSwapPlayer,
  partnerId,
  isSwap,
}) => {
  const { players, courts, gameRounds, pairs } = React.useContext(AppContext);
  return (
    <>
      {isSwap ? (
        <TouchableOpacity
          key={playerId}
          style={[
            styles.playerButton,
            isSwap && swapPlayer === playerId && styles.swapPlayerButton,
          ]}
          onPress={async () => {
            isSwap && selectSwapPlayer(playerId, partnerId);

            await analytics().logEvent("swap_player");
          }}
        >
          <PlayerInfo playerId={playerId} />
          {isSwap && (
            <Ionicons
              name="swap-horizontal"
              size={14}
              color={ColorPalette.secondary}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View key={playerId} style={styles.playerButton}>
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
