import { STORAGE_KEYS } from "@/constants/storage";
import {
  Court,
  GameRound,
  Gender,
  GenderPreferenceSetting,
  GenerateMode,
  Pair,
  Player,
  Rank,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const savePlayerInfo = async (
  players: { id: number; name: string; gender: Gender; rank: Rank }[],
) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.error("保存エラー:", e);
  }
};

export const saveGameData = async ({
  gameRounds,
  courts,
  generateMode,
  recentPlayers,
  anonymousPlayerCount,
  pairs,
  genderSetting,
  isAdjustMatchCount,
  saveAt,
}: {
  gameRounds: GameRound[];
  courts: Court[];
  generateMode: GenerateMode;
  recentPlayers: Player[];
  anonymousPlayerCount: number;
  pairs: Pair[];
  genderSetting: GenderPreferenceSetting;
  isAdjustMatchCount: boolean;
  saveAt?: number;
}) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.GAME_DATA,
      JSON.stringify({
        gameRounds,
        courts,
        generateMode,
        recentPlayers,
        anonymousPlayerCount,
        pairs,
        genderSetting,
        isAdjustMatchCount,
        saveAt,
      }),
    );
  } catch (e) {
    console.error("保存エラー:", e);
  }
};

export const clearGameData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.GAME_DATA);
  } catch (e) {
    console.error("クリアエラー:", e);
  }
};
