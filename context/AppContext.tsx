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
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isPairUnlocked: boolean;
  setIsPairUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
  isRestUnlocked: boolean;
  setIsRestUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
  isProUser: boolean;
  setIsProUser: React.Dispatch<React.SetStateAction<boolean>>;
  numOfGenerate: number;
  setNumOfGenerate: React.Dispatch<React.SetStateAction<number>>;
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
  isLoading: false,
  setIsLoading: () => {},
  isPairUnlocked: false,
  setIsPairUnlocked: () => {},
  isRestUnlocked: false,
  setIsRestUnlocked: () => {},
  isProUser: false,
  setIsProUser: () => {},
  numOfGenerate: 0,
  setNumOfGenerate: () => {},
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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isPairUnlocked, setIsPairUnlocked] = React.useState<boolean>(false);
  const [isRestUnlocked, setIsRestUnlocked] = React.useState<boolean>(false);
  const [isProUser, setIsProUser] = React.useState<boolean>(false);
  const [numOfGenerate, setNumOfGenerate] = React.useState<number>(0);

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
        isLoading,
        setIsLoading,
        isPairUnlocked,
        setIsPairUnlocked,
        isRestUnlocked,
        setIsRestUnlocked,
        isProUser,
        setIsProUser,
        numOfGenerate,
        setNumOfGenerate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
