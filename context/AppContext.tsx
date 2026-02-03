import {
  Court,
  GameRound,
  GenderPreferenceSetting,
  GenerateMode,
  Match,
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
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isRestore: boolean | null;
  setIsRestore: React.Dispatch<React.SetStateAction<boolean | null>>;
  newGames: Match["id"][];
  setNewGames: React.Dispatch<React.SetStateAction<Match["id"][]>>;
  isAdjustMatchCount: boolean;
  setIsAdjustMatchCount: React.Dispatch<React.SetStateAction<boolean>>;
  isPreferMatchCountOverPair: boolean;
  setIsPreferMatchCountOverPair: React.Dispatch<React.SetStateAction<boolean>>;
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
  isLoading: false,
  setIsLoading: () => {},
  isRestore: null,
  setIsRestore: () => {},
  newGames: [],
  setNewGames: () => {},
  isAdjustMatchCount: false,
  setIsAdjustMatchCount: () => {},
  isPreferMatchCountOverPair: false,
  setIsPreferMatchCountOverPair: () => {},
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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRestore, setIsRestore] = React.useState<boolean | null>(null);
  const [newGames, setNewGames] = React.useState<Match["id"][]>([]);
  const [isAdjustMatchCount, setIsAdjustMatchCount] =
    React.useState<boolean>(false);
  const [isPreferMatchCountOverPair, setIsPreferMatchCountOverPair] =
    React.useState<boolean>(false);

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
        isLoading,
        setIsLoading,
        isRestore,
        setIsRestore,
        newGames,
        setNewGames,
        isAdjustMatchCount,
        setIsAdjustMatchCount,
        isPreferMatchCountOverPair,
        setIsPreferMatchCountOverPair,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
