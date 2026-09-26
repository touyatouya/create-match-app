import { GameRound, Player } from "@/types";

export const getMinMatchCount = (
  gameRounds: GameRound[],
  otherPlayers: Player[],
): number => {
  const countMap = new Map<Player["id"], number>();

  console.log(
    "otherPlayers",
    otherPlayers.map((p) => p.name),
  );
  otherPlayers.forEach((p) => countMap.set(p.id, 0));

  gameRounds.forEach((round) => {
    round.matches.forEach((match) => {
      [...match.teamA, ...match.teamB].forEach((id) => {
        countMap.set(id, (countMap.get(id) ?? 0) + 1);
      });
    });
  });

  console.log("countMap", countMap);

  otherPlayers
    .filter((p) => p.isJoin)
    .forEach((player) => {
      const current = countMap.get(player.id) ?? 0;
      countMap.set(player.id, current + player.matchOffset);
    });

  console.log("countMap2", countMap);

  return Math.min(...countMap.values());
};
