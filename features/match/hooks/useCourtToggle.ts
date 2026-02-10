import { AppContext } from "@/context/AppContext";
import { useResetSwap } from "@/features/match/hooks/useResetSwap";
import { toggleCanInsertNext } from "@/features/match/logic/toggleCanInsertNext";
import { Court } from "@/types";
import { useContext } from "react";

export const useCourtToggle = () => {
  const { gameRounds, setGameRounds } = useContext(AppContext);
  const { resetSwap } = useResetSwap();

  const toggleCourtCanInsertNext = (
    courtId: Court["id"],
    dispRound: number,
  ) => {
    const newGameRounds = toggleCanInsertNext(gameRounds, courtId, dispRound);

    setGameRounds(newGameRounds);
    resetSwap();
  };
  return { toggleCourtCanInsertNext };
};
