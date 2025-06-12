import { Gender, Group, Rank } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const savePairs = async (
  pairs: { id: number; player1: number; player2: number }[]
) => {
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

export const saveGroups = async (groups: Group[]) => {
  try {
    await AsyncStorage.setItem("groups", JSON.stringify(groups));
  } catch (e) {
    console.error("保存エラー:", e);
  }
};
