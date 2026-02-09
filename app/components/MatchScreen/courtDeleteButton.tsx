import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { GameRound, GenerateMode, Match as MatchType, Player } from "@/types";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import { MaterialIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { countMatch } from "./util";

interface CourtDeleteButtonProps {
  item: MatchType;
  courtId: number;
  canDelete: boolean;
}

const CourtDeleteButton: React.FC<CourtDeleteButtonProps> = ({
  item,
  courtId,
  canDelete,
}) => {
  const {
    courts,
    setGameRounds,
    generateMode,
    players,
    setPlayers,
    pairs,
    genderSetting,
    isPreferMatchCountOverPair,
    setSwap,
  } = React.useContext(AppContext);

  const resetSwap = () => {
    setSwap({
      player: null,
      matchId: null,
      partner: null,
      isRestPlayer: false,
    });
  };

  const isNoMatch =
    (item.teamA == null || item.teamA.length === 0) &&
    (item.teamB == null || item.teamB.length === 0);

  if (
    generateMode !== GenerateMode.FILL_ENPTY ||
    isNoMatch ||
    !canDelete ||
    item.canInsertNext
  ) {
    return null;
  }

  const handleDelete = async () => {
    let newGameRounds: GameRound[] = [];
    setGameRounds((prev) => {
      newGameRounds = prev.map((gameRound) => {
        const newMatches = gameRound.matches.filter(
          (match) => !(!match.isFinished && match.courtId === courtId),
        );

        return {
          ...gameRound,
          matches: newMatches,
        };
      });
      return newGameRounds;
    });
    const newMatch = newGameRounds.flatMap((gameRound) => gameRound.matches);
    const newPlayers: Player[] = countMatch(newMatch, players, setPlayers);
    resetSwap();

    await clearGameData();
    await saveGameData({
      gameRounds: newGameRounds,
      courts,
      generateMode: generateMode,
      recentPlayers: newPlayers,
      anonymousPlayerCount: newPlayers.filter((p) => p.isAnonymous).length,
      pairs,
      genderSetting,
      isPreferMatchCountOverPair,
      saveAt: new Date().getTime(),
    });

    await analytics().logEvent("delete_match_by_court");
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          ...globalStyles.touch,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => handleDelete()}
      >
        <MaterialIcons name="delete-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default CourtDeleteButton;
