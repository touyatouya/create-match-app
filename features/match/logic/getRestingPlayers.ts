import { Player } from "@/types";
import { getPlayerIds } from "./getPlayerIds";

export const getRestingPlayers = (
  players: Player[],
  playingPlayer: Player[],
): Player[] => {
  const playingPlayerIds = getPlayerIds(playingPlayer);

  const restPlayers = players.filter(
    (player) => player.isJoin && !playingPlayerIds.includes(player.id),
  );

  return restPlayers;
};
