import { getMinMatchCount } from "@/features/player/logic/getMinMatchCount";
import { GameRound, Player } from "@/types";
import { getMatchCount } from "./getMatchCount";

export const attachMatchOffset = (
  player: Player,
  gameRounds: GameRound[],
  players: Player[],
): Player => {
  const otherPlayers = players.filter((p) => p.isJoin && p.id !== player.id);

  const min = getMinMatchCount(gameRounds, otherPlayers);
  const prevMatchCount = getMatchCount(player.id, gameRounds);

  return {
    ...player,
    matchOffset: prevMatchCount === 0 ? min : 0,
  };
};
