import { Court, GameRound } from "../../../types";
export const toggleCanInsertNext = (
  gameRounds: GameRound[],
  courtId: Court["id"],
  dispRound: number,
): GameRound[] => {
  return gameRounds.map((gameRound) => {
    const newMatches = gameRound.matches.map((match) => {
      if (!match.isFinished && match.courtId === courtId) {
        return {
          ...match,
          canInsertNext: !match.canInsertNext,
          finishRound: dispRound,
        };
      }
      return {
        ...match,
      };
    });

    return {
      ...gameRound,
      matches: newMatches,
    };
  });
};
