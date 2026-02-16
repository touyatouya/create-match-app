import { Player } from "@/types";

export const getPlayerGender = (id: number, players: Player[]) => {
  return players.find((player) => player.id === id)?.gender;
};
