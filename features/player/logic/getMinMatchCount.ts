import { GameRound, Player } from "@/types";

export const getMinMatchCount = (
  gameRounds: GameRound[],
  playerIds: Player["id"][],
): number => {
  const countMap = new Map<Player["id"], number>();

  playerIds.forEach((id) => countMap.set(id, 0));

  gameRounds.forEach((round) => {
    round.matches.forEach((match) => {
      [...match.teamA, ...match.teamB].forEach((id) => {
        countMap.set(id, (countMap.get(id) ?? 0) + 1);
      });
    });
  });

  return Math.min(...countMap.values());
};
