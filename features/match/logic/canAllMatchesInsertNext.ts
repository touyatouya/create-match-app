import { GameRound } from "@/types";

export const canAllMatchesInsertNext = (gameRounds: GameRound[]): boolean => {
  return gameRounds.every((gameRound) =>
    gameRound.matches.every((match) => match.canInsertNext),
  );
};
