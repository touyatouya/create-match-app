import { Player } from "@/types";

export const chunkArray = (arr: Player[], size = 2) => {
  if (size <= 0) {
    throw new Error("size must be greater than 0");
  }
  const chunks: Player[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};
