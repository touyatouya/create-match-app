import { AppContext } from "@/context/AppContext";
import { deleteMatchesByCourt } from "@/features/match/logic/deleteMatchesByCourt";
import { Court } from "@/types";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import analytics from "@react-native-firebase/analytics";
import { useContext } from "react";
import { countMatch } from "../logic/utils";

export const useDeleteMatchByCourt = () => {
  const {
    courts,
    gameRounds,
    setGameRounds,
    generateMode,
    players,
    setPlayers,
    pairs,
    genderSetting,
    isPreferMatchCountOverPair,
    setSwap,
  } = useContext(AppContext);

  const resetSwap = () => {
    setSwap({
      player: null,
      matchId: null,
      partner: null,
      isRestPlayer: false,
    });
  };

  const deleteByCourt = async (courtId: Court["id"]) => {
    const newGameRounds = deleteMatchesByCourt(gameRounds, courtId);

    setGameRounds(newGameRounds);

    const newMatch = newGameRounds.flatMap((gr) => gr.matches);
    const newPlayers = countMatch(newMatch, players, setPlayers);

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
