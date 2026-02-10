import { GameRound, Match, Player } from "@/types";

export const findPlayerTeamInMatch = (
  playerId: Player["id"],
  gameRounds: GameRound[],
  matchId: Match["id"],
): { team: "teamA" | "teamB"; teamIdx: number } | null => {
  const matches = gameRounds.flatMap((gr) => gr.matches.map((m) => m));
  const targetMatch = matches.find((m) => m.id === matchId);
  if (!targetMatch) return null;

  if (targetMatch.teamA.includes(playerId)) {
    return {
      team: "teamA" as const,
      teamIdx: targetMatch.teamA.indexOf(playerId) as number,
    };
  } else if (targetMatch.teamB.includes(playerId)) {
    return {
      team: "teamB" as const,
      teamIdx: targetMatch.teamB.indexOf(playerId) as number,
    };
  }
  return null;
};
