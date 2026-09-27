import { getPlayerIds } from "@/features/match/logic/getPlayerIds";
import { Gender, Player, Rank } from "@/types";
import { generateUniqId } from "@/utils/createId";
import { getNextAnonymousNumber } from "./getNextAnonymousNumber";

export const generateNewPlayer = (
  players: Player[],
  isAnonymous: boolean,
  name: Player["name"],
) => {
  const existingIds = getPlayerIds(players);
  const newId = generateUniqId(existingIds);

  const anonymousNumber = isAnonymous ? getNextAnonymousNumber(players) : null;

  const newPlayer: Player = {
    id: newId,
    name: isAnonymous ? anonymousNumber!.toString() : name,
    gender: Gender.未設定,
    matchOffset: 0,
    isJoin: true,
    isRest: false,
    rank: Rank.未設定,
    isAnonymous,
    anonymousNumber: isAnonymous ? anonymousNumber : null,
  };
  return newPlayer;
};
