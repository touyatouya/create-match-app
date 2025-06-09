import { Court, GameRound, Pair, Player } from "@/types";
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
});

type AppContextProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppContextProps) => {
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [courts, setCourts] = React.useState<Court[]>([{ id: 0 }]);
  const [gameRounds, setGameRounds] = React.useState<GameRound[]>([]);
  const [pairs, setPairs] = React.useState<Pair[]>([]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
