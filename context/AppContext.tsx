import { Court, GameRound, Group, Pair, Player } from "@/types";
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
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
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
  groups: [],
  setGroups: () => {},
});

type AppContextProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppContextProps) => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [courts, setCourts] = React.useState<Court[]>([{ id: 0 }]);
  const [gameRounds, setGameRounds] = React.useState<GameRound[]>([]);
  const [pairs, setPairs] = React.useState<Pair[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);

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
        groups,
        setGroups,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
