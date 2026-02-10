import { Match, Player } from "@/types";

export const replacePlayerInMatch = (
  match: Match,
  matchId: Match["id"],
  playerId: Player["id"],
  team: "teamA" | "teamB",
  teamIdx: number,
): Match | null => {
  if (match.id !== matchId) {
    return null;
  }

  let updatedMatch = { ...match };
  const newTeam = [...match[team]];
  newTeam[teamIdx] = playerId;
  updatedMatch[team] = newTeam;

  return updatedMatch;
};
