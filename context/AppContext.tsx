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
  newGames: Match["id"][];
  setNewGames: React.Dispatch<React.SetStateAction<Match["id"][]>>;
  isAdjustMatchCount: boolean;
  setIsAdjustMatchCount: React.Dispatch<React.SetStateAction<boolean>>;
  isPreferMatchCountOverPair: boolean;
  setIsPreferMatchCountOverPair: React.Dispatch<React.SetStateAction<boolean>>;
  swap: {
    player: Player["id"] | null;
    matchId: Match["id"] | null;
    partner: Player["id"] | null;
    isRestPlayer: boolean;
  };
  setSwap: React.Dispatch<
    React.SetStateAction<{
      player: Player["id"] | null;
      matchId: Match["id"] | null;
      partner: Player["id"] | null;
      isRestPlayer: boolean;
    }>
  >;
  dispRound: number;
  setDispRound: React.Dispatch<React.SetStateAction<number>>;
};

export const AppContext = createContext<AppContextType>({
  players: [],
  setPlayers: () => {},
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
  newGames: [],
  setNewGames: () => {},
  isAdjustMatchCount: false,
  setIsAdjustMatchCount: () => {},
  isPreferMatchCountOverPair: false,
  setIsPreferMatchCountOverPair: () => {},
  swap: {
    player: null,
    matchId: null,
    partner: null,
    isRestPlayer: false,
  },
  setSwap: () => {},
  dispRound: 0,
  setDispRound: () => {},
});

type AppContextProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppContextProps) => {
  const [players, setPlayers] = React.useState<Player[]>([]);
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
  const [newGames, setNewGames] = React.useState<Match["id"][]>([]);
  const [isAdjustMatchCount, setIsAdjustMatchCount] =
    React.useState<boolean>(false);
  const [isPreferMatchCountOverPair, setIsPreferMatchCountOverPair] =
    React.useState<boolean>(false);
  const [swap, setSwap] = React.useState<{
    player: Player["id"] | null;
    matchId: Match["id"] | null;
    partner: Player["id"] | null;
    isRestPlayer: boolean;
  }>({
    player: null,
    matchId: null,
    partner: null,
    isRestPlayer: false,
  });
  const [dispRound, setDispRound] = React.useState<number>(0);

  return (
    <AppContext.Provider
      value={{
        players,
        setPlayers,
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
        newGames,
        setNewGames,
        isAdjustMatchCount,
        setIsAdjustMatchCount,
        isPreferMatchCountOverPair,
        setIsPreferMatchCountOverPair,
        swap,
        setSwap,
        dispRound,
        setDispRound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
