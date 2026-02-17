import { getPlayerIds } from "@/features/match/logic/getPlayerIds";
import { Gender, Player, Rank } from "@/types";
import { generateUniqId } from "@/utils/createId";

export const generateNewPlayer = (
  players: Player[],
  isAnonymous: boolean,
  name: Player["name"],
) => {
  const existingIds = getPlayerIds(players);
  const newId = generateUniqId(existingIds);
  const anonymousPlayerCount = players.filter((p) => p.isAnonymous).length;
  const newPlayer: Player = {
    id: newId,
    name: isAnonymous ? (anonymousPlayerCount + 1).toString() : name,
    gender: Gender.未設定,
    matchOffset: 0,
    isJoin: false,
    isRest: false,
    rank: Rank.未設定,
    isAnonymous,
    anonymousNumber: isAnonymous ? anonymousPlayerCount + 1 : null,
  };
  return newPlayer;
};
