import { Player } from "@/types";

export const getNextAnonymousNumber = (players: Player[]): number => {
  const usedNumbers = new Set(
    players
      .filter((p) => p.isAnonymous)
      .map((p) => p.anonymousNumber)
      .filter((n): n is number => n !== null),
  );

  let number = 1;

  while (usedNumbers.has(number)) {
    number++;
  }

  return number;
};
