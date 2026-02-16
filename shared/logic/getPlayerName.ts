import { Player } from "@/types";

export const getPlayerName = (id: number, players: Player[]) => {
  return players.find((player) => player.id === id)?.name;
};
