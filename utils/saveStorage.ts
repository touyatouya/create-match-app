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

export const saveIsAdjustMatchCount = async (isAdjustMatchCount: boolean) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.IS_ADJUST_MATCH_COUNT,
      JSON.stringify(isAdjustMatchCount),
    );
  } catch (e) {
    console.error("保存エラー:", e);
  }
};

export const saveGameData = async ({
  gameRounds,
  courts,
  generateMode,
  recentPlayers,
  pairs,
  genderSetting,
  saveAt,
  isPreferMatchCountOverPair,
}: {
  gameRounds: GameRound[];
  courts: Court[];
  generateMode: GenerateMode;
  recentPlayers: Player[];
  pairs: Pair[];
  genderSetting: GenderPreferenceSetting;
  isPreferMatchCountOverPair: boolean;
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
        pairs,
        genderSetting,
        isPreferMatchCountOverPair,
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
