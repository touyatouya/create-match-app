import { GameRound, Player } from "@/types";

export const getMatchCount = (
  playerId: Player["id"],
  gameRounds: GameRound[],
) => {
  let count = 0;
  gameRounds.forEach((round) => {
    round.matches.forEach((match) => {
      [...match.teamA, ...match.teamB].forEach((id) => {
        if (id === playerId) {
          count++;
        }
      });
    });
  });

  return count;
};
