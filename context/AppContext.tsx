import { CourtSet, Player } from "@/types";
import React, { createContext, ReactNode } from "react";

type AppContextType = {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  coatCount: number;
  setCoatCount: React.Dispatch<React.SetStateAction<number>>;
  playerId: number;
  setPlayerId: React.Dispatch<React.SetStateAction<number>>;
  courtSets: CourtSet[];
  setCourtSets: React.Dispatch<React.SetStateAction<CourtSet[]>>;
  round: number;
  setRound: React.Dispatch<React.SetStateAction<number>>;
};

export const AppContext = createContext<AppContextType>({
  players: [],
  setPlayers: () => {},
  coatCount: 0,
  setCoatCount: () => {},
  playerId: 0,
  setPlayerId: () => {},
  courtSets: [],
  setCourtSets: () => {},
  round: 0,
  setRound: () => {},
});

type AppContextProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppContextProps) => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [coatCount, setCoatCount] = React.useState(1);
  const [playerId, setPlayerId] = React.useState<number>(0);
  const [courtSets, setCourtSets] = React.useState<CourtSet[]>([]);
  const [round, setRound] = React.useState(0);

  return (
    <AppContext.Provider
      value={{
        players,
        setPlayers,
        coatCount,
        setCoatCount,
        playerId,
        setPlayerId,
        courtSets,
        setCourtSets,
        round,
        setRound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
