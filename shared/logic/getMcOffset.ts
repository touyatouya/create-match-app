import { Player } from "@/types";

export const getMcOffset = (
  players: Player[],
  id: Player["id"],
): Player["matchOffset"] => {
  const matchOffset = players.find((player) => player.id === id)?.matchOffset;

  return matchOffset ?? 0;
};
