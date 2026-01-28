import {
  Court,
  GameRound,
  GenderPreferenceSetting,
  GenerateMode,
  Pair,
  Player,
} from "@/types";
import { generateUniqId } from "@/utils/createId";
import React, { createContext, ReactNode } from "react";

type AppContextType = {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  anonymousPlayerCount: number;
  setAnonymousPlayerCount: React.Dispatch<React.SetStateAction<number>>;
  courts: Court[];
  setCourts: React.Dispatch<React.SetStateAction<Court[]>>;
  gameRounds: GameRound[];
  setGameRounds: React.Dispatch<React.SetStateAction<GameRound[]>>;
  generateMode: GenerateMode;
  setGenerateMode: React.Dispatch<React.SetStateAction<GenerateMode>>;
  pairs: Pair[];
  setPairs: React.Dispatch<React.SetStateAction<Pair[]>>;
  genderSetting: GenderPreferenceSetting;
  setGenderSetting: React.Dispatch<
    React.SetStateAction<GenderPreferenceSetting>
  >;
  // filters: Filter[];
  // setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
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
  anonymousPlayerCount: 0,
  setAnonymousPlayerCount: () => {},
  courts: [],
  setCourts: () => {},
  gameRounds: [],
  setGameRounds: () => {},
  generateMode: GenerateMode.REPLACE_ALL,
  setGenerateMode: () => {},
  pairs: [],
  setPairs: () => {},
  genderSetting: { men: false, woman: false, mix: false },
  setGenderSetting: () => {},
  // filters: [],
  // setFilters: () => {},
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
  const [anonymousPlayerCount, setAnonymousPlayerCount] =
    React.useState<number>(0);
  const [courts, setCourts] = React.useState<Court[]>([
    { id: generateUniqId([]), number: 1 },
  ]);
  const [gameRounds, setGameRounds] = React.useState<GameRound[]>([]);
  const [generateMode, setGenerateMode] = React.useState<GenerateMode>(
    GenerateMode.REPLACE_ALL,
  );
  const [pairs, setPairs] = React.useState<Pair[]>([]);
  const [genderSetting, setGenderSetting] =
    React.useState<GenderPreferenceSetting>({
      men: false,
      woman: false,
      mix: false,
    });
  // const [filters, setFilters] = React.useState<Filter[]>([]);
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
        anonymousPlayerCount,
        setAnonymousPlayerCount,
        courts,
        setCourts,
        gameRounds,
        setGameRounds,
        generateMode,
        setGenerateMode,
        pairs,
        setPairs,
        genderSetting,
        setGenderSetting,
        // filters,
        // setFilters,
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
