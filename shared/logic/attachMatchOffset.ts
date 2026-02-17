import { getPlayerIds } from "@/features/match/logic/getPlayerIds";
import { getMinMatchCount } from "@/features/player/logic/getMinMatchCount";
import { GameRound, Player } from "@/types";
import { getMatchCount } from "./getMatchCount";

export const attachMatchOffset = (
  player: Player,
  gameRounds: GameRound[],
  players: Player[],
): Player => {
  const otherPlayerIds = getPlayerIds(players).filter(
    (pId) => pId !== player.id,
  );
  const min = getMinMatchCount(gameRounds, otherPlayerIds);
  const prevMatchCount = getMatchCount(player.id, gameRounds);

  return {
    ...player,
    matchOffset: prevMatchCount === 0 ? min : 0,
  };
};
