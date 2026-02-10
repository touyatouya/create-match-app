import { Court, GameRound } from "@/types";

export const deleteMatchesByCourt = (
  gameRounds: GameRound[],
  courtId: Court["id"],
): GameRound[] => {
  return gameRounds.map((gameRound) => ({
    ...gameRound,
    matches: gameRound.matches.filter(
      (match) => match.isFinished || match.courtId !== courtId,
    ),
  }));
};
