import { AppContext } from "@/context/AppContext";
import { GameRound, Match } from "@/types";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import analytics from "@react-native-firebase/analytics";
import { useContext } from "react";
import { flatGrToM } from "../logic/flatGrToM";
import { sliceLastGr } from "../logic/sliceLastGr";
import { useCountMatch } from "./useCountMatch";
import { useResetSwap } from "./useResetSwap";

export const useDeleteGr = () => {
  const {
    gameRounds,
    setGameRounds,
    players,
    setDispRound,
    courts,
    generateMode,
    pairs,
    genderSetting,
    isPreferMatchCountOverPair,
  } = useContext(AppContext);

  const { resetSwap } = useResetSwap();
  const { countMatch } = useCountMatch();

  const deleteLastGr = async () => {
    const newGameRounds: GameRound[] = sliceLastGr(gameRounds);
    setGameRounds(newGameRounds);
    const newMatch: Match[] = flatGrToM(newGameRounds);
    const newPlayers = countMatch(newMatch, players);
    resetSwap();
    setDispRound((prev) => prev - 1);

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

    await analytics().logEvent("delete_game");
  };

  return { deleteLastGr };
};
