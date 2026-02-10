import { AppContext } from "@/context/AppContext";
import { canAllMatchesInsertNext } from "@/features/match/logic/canAllMatchesInsertNext";
import { toggleAllCourtCanInsertNext } from "@/features/match/logic/toggleAllCourtCanInsertNext";
import { useContext } from "react";

export const useAllCourtToggle = () => {
  const { gameRounds, setGameRounds } = useContext(AppContext);

  const isAllMatchCanInsertNext = canAllMatchesInsertNext(gameRounds);

  const toggleAllCourt = () => {
    const newGameRounds = toggleAllCourtCanInsertNext(
      gameRounds,
      isAllMatchCanInsertNext,
    );

    setGameRounds(newGameRounds);
  };
  return { toggleAllCourt, isAllMatchCanInsertNext };
};
