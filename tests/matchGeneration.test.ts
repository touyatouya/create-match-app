// matchGeneration.test.ts

import {
  selectBestGameRounds,
  selectPlayersForNextRound,
} from "../features/match/logic/utils";

import {
  Court,
  GameRound,
  Gender,
  GenerateMode,
  Match as MatchType,
  Player,
  Rank,
} from "../types";

type TestResult = {
  playerCount: number;
  courtCount: number;
  rounds: number;
  pairCounts: Map<string, number>;
  facedCounts: Map<string, number>;
  matchCounts: Map<number, number>;
};

/**
 * プレイヤーを作成
 */
const createPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Player${i + 1}`,
    gender: i % 2 === 0 ? Gender.男性 : Gender.女性,
    isJoin: true,
    isRest: false,
    isAnonymous: false,
    matchOffset: 0,
    rank: Rank.未設定,
    anonymousNumber: null,
  }));
};

/**
 * コートを作成
 */
const createCourts = (count: number): Court[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Court${i + 1}`,
    number: i + 1,
  }));
};

/**
 * ペアキー
 *
 * 1-2 と 2-1 を同じペアとして扱う
 */
const getPairKey = (p1: number, p2: number): string => {
  return [p1, p2].sort((a, b) => a - b).join("-");
};

/**
 * 過去の試合から
 * 「同じチームだった回数」を集計
 */
const countPairs = (matches: MatchType[]): Map<string, number> => {
  const result = new Map<string, number>();

  for (const match of matches) {
    const teams = [match.teamA, match.teamB];

    for (const team of teams) {
      for (let i = 0; i < team.length; i++) {
        for (let j = i + 1; j < team.length; j++) {
          const key = getPairKey(team[i], team[j]);

          result.set(key, (result.get(key) ?? 0) + 1);
        }
      }
    }
  }

  return result;
};

/**
 * 「対戦した回数」を集計
 */
const countFaced = (matches: MatchType[]): Map<string, number> => {
  const result = new Map<string, number>();

  for (const match of matches) {
    for (const playerA of match.teamA) {
      for (const playerB of match.teamB) {
        const key = getPairKey(playerA, playerB);

        result.set(key, (result.get(key) ?? 0) + 1);
      }
    }
  }

  return result;
};

/**
 * 各プレイヤーの試合数を集計
 */
const countMatches = (matches: MatchType[]): Map<number, number> => {
  const result = new Map<number, number>();

  for (const match of matches) {
    for (const player of [...match.teamA, ...match.teamB]) {
      result.set(player, (result.get(player) ?? 0) + 1);
    }
  }

  return result;
};

/**
 * テスト本体
 */
const runTest = (
  playerCount: number,
  courtCount: number,
  roundCount: number,
): TestResult => {
  const players = createPlayers(playerCount);
  const courts = createCourts(courtCount);

  let gameRounds: GameRound[] = [];

  for (let round = 0; round < roundCount; round++) {
    const matches = gameRounds.flatMap((round) => round.matches);

    const { priorityPlayers, normalPlayers, avaibleCourts } =
      selectPlayersForNextRound(
        players,
        courts,
        gameRounds,
        matches,
        [],
        GenerateMode.FILL_EMPTY,
        true,
      );

    const gameRound = selectBestGameRounds(
      priorityPlayers.map((p) => p.id),
      normalPlayers.map((p) => p.id),
      avaibleCourts,
      gameRounds,
      [],
      matches,
      players,
      {
        men: false,
        woman: false,
        mix: false,
      },
      true,
    );

    expect(gameRound).toBeDefined();

    // テスト上では「このラウンドが終了した」状態にする
    const completedGameRound: GameRound = {
      ...gameRound,
      matches: gameRound.matches.map((match) => ({
        ...match,
        canInsertNext: true,
      })),
    };

    gameRounds.push(completedGameRound);
  }

  const matches = gameRounds.flatMap((round) => round.matches);

  return {
    playerCount,
    courtCount,
    rounds: gameRounds.length,
    pairCounts: countPairs(matches),
    facedCounts: countFaced(matches),
    matchCounts: countMatches(matches),
  };
};

/**
 * 理想値と実績を表示
 */
const printResult = (result: TestResult) => {
  const pairValues = [...result.pairCounts.values()];
  const facedValues = [...result.facedCounts.values()];
  const matchValues = [...result.matchCounts.values()];

  const pairMin = Math.min(...pairValues);
  const pairMax = Math.max(...pairValues);

  const facedMin = Math.min(...facedValues);
  const facedMax = Math.max(...facedValues);

  const matchMin = Math.min(...matchValues);
  const matchMax = Math.max(...matchValues);

  // プレイヤー数
  const playerCount = result.playerCount;

  // コート数
  const courtCount = result.courtCount;

  // 実際の試合数
  const totalMatches = result.rounds * courtCount;

  // -----------------------------
  // ペアの理想値
  // -----------------------------
  //
  // 1試合あたり2ペア
  //
  // 例:
  // 100ラウンド × 2コート × 2ペア = 400ペア
  //
  // プレイヤー2人の組み合わせ数:
  // nC2
  //
  const pairCombinationCount = (playerCount * (playerCount - 1)) / 2;

  const totalPairs = result.rounds * courtCount * 2;

  const idealPairCount = totalPairs / pairCombinationCount;

  // -----------------------------
  // 対戦の理想値
  // -----------------------------
  //
  // 1試合につき
  // 2人 × 2人 = 4通り
  //
  const facedCombinationCount = (playerCount * (playerCount - 1)) / 2;

  const totalFaced = result.rounds * courtCount * 4;

  const idealFacedCount = totalFaced / facedCombinationCount;

  // -----------------------------
  // 結果
  // -----------------------------

  console.log("");
  console.log(`===== ${playerCount}人 × ${courtCount}コート =====`);

  console.log(`生成ラウンド: ${result.rounds}`);

  console.log("");
  console.log("【ペア】");

  console.log(`理想値: ${idealPairCount.toFixed(1)}回`);

  console.log(`実績: ${pairMin} ～ ${pairMax}回`);

  console.log(
    `最大乖離: ${Math.max(
      Math.abs(pairMin - idealPairCount),
      Math.abs(pairMax - idealPairCount),
    ).toFixed(1)}回`,
  );

  console.log("");
  console.log("【対戦】");

  console.log(`理想値: ${idealFacedCount.toFixed(1)}回`);

  console.log(`実績: ${facedMin} ～ ${facedMax}回`);

  console.log(
    `最大乖離: ${Math.max(
      Math.abs(facedMin - idealFacedCount),
      Math.abs(facedMax - idealFacedCount),
    ).toFixed(1)}回`,
  );

  console.log("");
  console.log("【試合数】");

  console.log(`実績: ${matchMin} ～ ${matchMax}回`);

  console.log(
    `最大乖離: ${Math.max(Math.abs(matchMin - matchMax), 0).toFixed(1)}回`,
  );

  /**
   * 特に多いペア
   */
  const topPairs = [...result.pairCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log("");
  console.log("ペア回数 TOP5:");

  for (const [key, count] of topPairs) {
    console.log(`  ${key}: ${count}回`);
  }

  /**
   * 特に多い対戦
   */
  const topFaced = [...result.facedCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log("");
  console.log("対戦回数 TOP5:");

  for (const [key, count] of topFaced) {
    console.log(`  ${key}: ${count}回`);
  }
};
/**
 * 実際のテスト
 */
describe("組み合わせ生成アルゴリズム", () => {
  const testCases = [
    [8, 2],
    [10, 2],
    [12, 3],
    [14, 3],
    [16, 4],
  ];

  test.each(testCases)("%i人 × %iコート", (playerCount, courtCount) => {
    const result = runTest(playerCount, courtCount, 100);

    printResult(result);

    /**
     * 100ラウンドすべて生成できること
     */
    expect(result.rounds).toBe(100);

    /**
     * 試合数が極端に偏っていないこと
     *
     * 参加者選定自体は今回のテスト対象外なので、
     * 「参加回数を完全一致させる」ことはここでは要求しない。
     */
    const matchValues = [...result.matchCounts.values()];

    const maxMatch = Math.max(...matchValues);
    const minMatch = Math.min(...matchValues);

    expect(maxMatch - minMatch).toBeLessThanOrEqual(1);
  });
});
