import { Court, Filter, GameRound, Pair, Player } from "@/types";
import React, { createContext, ReactNode } from "react";

type AppContextType = {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  courts: Court[];
  setCourts: React.Dispatch<React.SetStateAction<Court[]>>;
  gameRounds: GameRound[];
  setGameRounds: React.Dispatch<React.SetStateAction<GameRound[]>>;
  pairs: Pair[];
  setPairs: React.Dispatch<React.SetStateAction<Pair[]>>;
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
};

export const AppContext = createContext<AppContextType>({
  players: [],
  setPlayers: () => {},
  courts: [],
  setCourts: () => {},
  gameRounds: [],
  setGameRounds: () => {},
  pairs: [],
  setPairs: () => {},
  filters: [],
  setFilters: () => {},
});

type AppContextProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppContextProps) => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [courts, setCourts] = React.useState<Court[]>([{ id: 0 }]);
  const [gameRounds, setGameRounds] = React.useState<GameRound[]>([]);
  const [pairs, setPairs] = React.useState<Pair[]>([]);
  const [filters, setFilters] = React.useState<Filter[]>([]);

  return (
    <AppContext.Provider
      value={{
        players,
        setPlayers,
        courts,
        setCourts,
        gameRounds,
        setGameRounds,
        pairs,
        setPairs,
        filters,
        setFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
