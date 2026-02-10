import { GameRound } from "@/types";

export const toggleAllCourtCanInsertNext = (
  gameRounds: GameRound[],
  isAllMatchCanInsertNext: boolean,
) => {
  return gameRounds.map((gameRound) => {
    const newMatches = gameRound.matches.map((match) => {
      if (!match.isFinished) {
        return {
          ...match,
          canInsertNext: !isAllMatchCanInsertNext,
        };
      }
      return match;
    });
    return { ...gameRound, matches: newMatches };
  });
};
