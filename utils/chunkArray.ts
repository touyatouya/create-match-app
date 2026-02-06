import { Player } from "@/types";

// restPlayers を 2 件ずつの行に分割するヘルパー
export const chunkArray = (arr: Player[], size = 2) => {
  const chunks: Player[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};
