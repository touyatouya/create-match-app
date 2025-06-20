import { Filter, Gender, Pair, Rank } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const savePairs = async (pairs: Pair[]) => {
  try {
    await AsyncStorage.setItem("pairs", JSON.stringify(pairs));
  } catch (e) {
    console.error("保存エラー:", e);
  }
};

export const savePlayerInfo = async (
  players: { id: number; name: string; gender: Gender; rank: Rank }[]
) => {
  try {
    await AsyncStorage.setItem("players", JSON.stringify(players));
  } catch (e) {
    console.error("保存エラー:", e);
  }
};

export const saveFilters = async (filters: Filter[]) => {
  try {
    await AsyncStorage.setItem("filters", JSON.stringify(filters));
  } catch (e) {
    console.error("保存エラー:", e);
  }
};
