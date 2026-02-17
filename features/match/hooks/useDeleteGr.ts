import { AppContext } from "@/context/AppContext";
import { GameRound } from "@/types";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import analytics from "@react-native-firebase/analytics";
import { useContext } from "react";
import { sliceLastGr } from "../logic/sliceLastGr";
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

  const deleteLastGr = async () => {
    const newGameRounds: GameRound[] = sliceLastGr(gameRounds);
    setGameRounds(newGameRounds);
    resetSwap();
    setDispRound((prev) => prev - 1);

    await clearGameData();
    await saveGameData({
      gameRounds: newGameRounds,
      courts,
      generateMode: generateMode,
      recentPlayers: players,
      pairs,
      genderSetting,
      isPreferMatchCountOverPair,
      saveAt: new Date().getTime(),
    });

    await analytics().logEvent("delete_game");
  };

  return { deleteLastGr };
};
