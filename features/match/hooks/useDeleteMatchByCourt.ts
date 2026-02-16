import { AppContext } from "@/context/AppContext";
import { deleteMatchesByCourt } from "@/features/match/logic/deleteMatchesByCourt";
import { Court, Match } from "@/types";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import analytics from "@react-native-firebase/analytics";
import { useContext } from "react";
import { flatGrToM } from "../logic/flatGrToM";
import { useCountMatch } from "./useCountMatch";
import { useResetSwap } from "./useResetSwap";

export const useDeleteMatchByCourt = () => {
  const {
    courts,
    gameRounds,
    setGameRounds,
    generateMode,
    players,
    pairs,
    genderSetting,
    isPreferMatchCountOverPair,
  } = useContext(AppContext);

  const { resetSwap } = useResetSwap();
  const { countMatch } = useCountMatch();

  const deleteByCourt = async (courtId: Court["id"]) => {
    const newGameRounds = deleteMatchesByCourt(gameRounds, courtId);

    setGameRounds(newGameRounds);

    const newMatch: Match[] = flatGrToM(newGameRounds);
    const newPlayers = countMatch(newMatch, players);

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

  return { deleteByCourt };
};
