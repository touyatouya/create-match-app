// export interface Player {
//   id: string;
//   name: string;
//   isResting: boolean;
//   matchCount: number; // プレイヤーの試合数を追跡
// }

// export interface Court {
//   id: string;
//   courtNumber: number;
// }

// export interface Match {
//   id: string;
//   courtId: string;
//   players: Player[];
// }

// export interface AppState {
//   players: Player[];
//   courts: Court[];
//   matches: Match[];
//   history: Match[][]; // 過去の試合組み合わせを保存
// }

export interface Player {
  id: number;
  name: string;
  matchCount: number;
  isRest: boolean;
  isJoin: boolean;
  teammatePlayerIds: Player["id"][];
  opponentPlayerIds: Player["id"][];
}

export interface Match {
  id: number;
  teamA: Player["id"][]; // 使用例：idが1・2 VS 3・4の場合、{...,teamA:[1,2], teamB:[3,4]...}
  teamB: Player["id"][];
  coatNumber: number; // 何コートの試合か
}

export interface CourtSet {
  id: number;
  courts: Match[];
}

export interface Pair {
  id: number;
  player1: number;
  player2: number;
}

export type Team = "teamA" | "teamB";
