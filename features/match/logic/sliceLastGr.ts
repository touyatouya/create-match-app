import { GameRound } from "@/types";

export const sliceLastGr = (gameRounds: GameRound[]): GameRound[] => {
  if (gameRounds.length === 0) return gameRounds;
  const newGameRounds = gameRounds.slice(0, -1);
  if (newGameRounds.length > 0) {
    newGameRounds[newGameRounds.length - 1] = {
      ...newGameRounds[newGameRounds.length - 1],
      matches: newGameRounds[newGameRounds.length - 1].matches.map((m) => ({
        ...m,
        isFinished: false,
        canInsertNext: false,
      })),
    };
  }
  return newGameRounds;
};
