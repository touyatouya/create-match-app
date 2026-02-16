import { AppContext } from "@/context/AppContext";
import { Match, Player } from "@/types";
import { useContext } from "react";

export const useCountMatch = () => {
  const { setPlayers } = useContext(AppContext);

  const countMatch = (match: Match[], players: Player[]) => {
    const playerIds: number[] = match.flatMap((m) => [...m.teamA, ...m.teamB]);

    const matchCountedPlayers: Player[] = players.map((player) => {
      return {
        ...player,
        matchCount: playerIds.filter((item) => item === player.id).length,
      };
    });
    setPlayers(matchCountedPlayers);
    return matchCountedPlayers;
  };

  return { countMatch };
};
