import { Pair } from "@/types";

export const findPairPlayerId = (id: number, pairs: Pair[]) => {
  let isPlayer1 = false;
  let isPlayer2 = false;
  const pair = pairs.find((pair) => {
    isPlayer1 = pair.player1 === id;
    isPlayer2 = pair.player2 === id;
    return isPlayer1 || isPlayer2;
  });

  if (pair) {
    if (isPlayer1) return pair.player2;
    if (isPlayer2) return pair.player1;
  }
};
