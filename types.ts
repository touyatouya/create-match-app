export interface Player {
  id: number;
  name: string;
  gender: Gender;
  matchCount: number;
  isRest: boolean;
  isJoin: boolean;
  rank: Rank;
}

// export interface Filter {
//   id: number;
//   name: string;
//   players: number[];
// }

export enum Gender {
  男性 = "男性",
  女性 = "女性",
  未設定 = "未設定",
}
export interface GenderPreferenceSetting {
  mix: boolean;
  men: boolean;
  woman: boolean;
}

export interface Match {
  id: number;
  teamA: Player["id"][]; // 使用例：idが1・2 VS 3・4の場合、{...,teamA:[1,2], teamB:[3,4]...}
  teamB: Player["id"][];
  courtId: number; // 何コートの試合か
}

export interface GameRound {
  id: number;
  matches: Match[];
}

export interface Pair {
  id: number;
  player1: number;
  player2: number;
}

export interface Court {
  id: number;
}

export type Team = "teamA" | "teamB";

export enum Rank {
  A = "Aランク",
  B = "Bランク",
  C = "Cランク",
  D = "Dランク",
  E = "Eランク",
  未設定 = "未設定",
}

export const rankOrder: Record<Rank, number> = {
  [Rank.A]: 0,
  [Rank.B]: 1,
  [Rank.C]: 2,
  [Rank.D]: 3,
  [Rank.E]: 4,
  [Rank.未設定]: 999,
};
