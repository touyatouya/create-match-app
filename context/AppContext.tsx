import { CourtSet, Pair, Player } from "@/types";
import React, { createContext, ReactNode } from "react";

type AppContextType = {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  coatCount: number;
  setCoatCount: React.Dispatch<React.SetStateAction<number>>;
  courtSets: CourtSet[];
  setCourtSets: React.Dispatch<React.SetStateAction<CourtSet[]>>;
  round: number;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  pairs: Pair[];
  setPairs: React.Dispatch<React.SetStateAction<Pair[]>>;
};

export const AppContext = createContext<AppContextType>({
  players: [],
  setPlayers: () => {},
  coatCount: 0,
  setCoatCount: () => {},
  courtSets: [],
  setCourtSets: () => {},
  round: 0,
  setRound: () => {},
  pairs: [],
  setPairs: () => {},
});

type AppContextProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppContextProps) => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [coatCount, setCoatCount] = React.useState(1);
  const [courtSets, setCourtSets] = React.useState<CourtSet[]>([]);
  const [round, setRound] = React.useState(0);
  const [pairs, setPairs] = React.useState<Pair[]>([]);

  return (
    <AppContext.Provider
      value={{
        players,
        setPlayers,
        coatCount,
        setCoatCount,
        courtSets,
        setCourtSets,
        round,
        setRound,
        pairs,
        setPairs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
