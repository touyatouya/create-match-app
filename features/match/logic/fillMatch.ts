import { Court, Match } from "@/types";
import { generateUniqId } from "@/utils/createId";

export const fillMatch = (matches: Match[], courts: Court[]) => {
  const active = matches.filter((m) => !m.isFinished);
  const sortedCourts = courts.slice().sort((a, b) => a.number - b.number);
  return sortedCourts.map((court) => {
    const m = active.find((am) => am.courtId === court.id);
    if (m == null) {
      return {
        id: generateUniqId(matches.map((m) => m.id)),
        courtId: court.id,
        teamA: [],
        teamB: [],
        isFinished: false,
        canInsertNext: true,
        finishRound: null,
      };
    }
    return m;
  });
};
