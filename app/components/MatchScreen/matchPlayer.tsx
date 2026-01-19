import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
// import analytics from "@react-native-firebase/analytics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { default as PlayerInfo } from "./playerInfo";
// import SelectPlayerModal from "./selectPlayerModal";

interface MatchPlayerProps {
  swapPlayer: number | null;
  playerId: number | null;
  selectSwapPlayer: (id: number, partnerId?: number | null) => void;
  partnerId: number | undefined | null;
  isSwap: boolean;
  isSelect: boolean;
  showMatchCount: boolean;
  team: "teamA" | "teamB";
  courtId?: number;
}

const MatchPlayer: React.FC<MatchPlayerProps> = ({
  swapPlayer,
  playerId,
  selectSwapPlayer,
  partnerId,
  isSwap,
  isSelect,
  showMatchCount,
  team,
  courtId,
}) => {
  const { players, courts, gameRounds, pairs } = React.useContext(AppContext);
  // const [isOpen, setIsOpen] = React.useState(false);

  // if (isOpen) {
  //   return (
  //     <SelectPlayerModal
  //       isOpen={isOpen}
  //       onClose={() => setIsOpen(false)}
  //       courtId={courtId}
  //       team={team}
  //     />
  //   );
  // }

  return (
    <>
      {playerId != null && isSwap ? (
        <TouchableOpacity
          key={playerId}
          style={[
            styles.playerButton,
            isSwap && swapPlayer === playerId && styles.swapPlayerButton,
          ]}
          onPress={async () => {
            isSwap && selectSwapPlayer(playerId, partnerId);

            // await analytics().logEvent("swap_player");
          }}
        >
          <PlayerInfo playerId={playerId} showMatchCount={showMatchCount} />
          {isSwap && (
            <Ionicons
              name="swap-horizontal"
              size={14}
              color={ColorPalette.secondary}
            />
          )}
        </TouchableOpacity>
      ) : playerId == null && isSelect ? (
        <TouchableOpacity
          key={playerId}
          style={[styles.playerButton]}
          onPress={async () => {}}
        >
          <PlayerInfo playerId={null} showMatchCount={false} />
          {isSelect && (
            <Ionicons
              name="swap-horizontal"
              size={18}
              color={ColorPalette.secondary}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View key={playerId} style={styles.playerButton}>
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
