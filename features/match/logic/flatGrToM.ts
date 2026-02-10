import { GameRound, Match } from "@/types";

export const flatGrToM = (gameRounds: GameRound[]): Match[] => {
  return gameRounds.flatMap((gameRound) => gameRound.matches);
};
