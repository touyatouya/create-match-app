import { Player } from "@/types";

export const getPlayerMc = (id: number, players: Player[]) => {
  return players.find((player) => player.id === id)?.matchCount;
};
