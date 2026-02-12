import { Player } from "@/types";

export const getPlayerIds = (players: Player[]): Player["id"][] => {
  const playingIds = players.map((p) => p.id);
  return playingIds;
};
