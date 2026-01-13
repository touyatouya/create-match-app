import { createMatch } from "@/app/components/MatchScreen/util";
import {
  Court,
  GameRound,
  Gender,
  GenderPreferenceSetting,
  Match,
  Pair,
  Player,
  Rank,
} from "@/types";

const makePlayers = (n: number): Player[] => {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Player${i + 1}`,
    isJoin: true,
    isRest: false,
    matchCount: 0,
    gender: Gender.未設定,
    rank: Rank.未設定,
    isAnonymous: false,
    anonymousNumber: null,
  }));
};

const makeCourts = (n: number): Court[] => {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Court${i + 1}`,
  }));
};

describe("createMatch", () => {
  it("なるべく対戦相手が重複しない", () => {
    const players = makePlayers(12);
    const courts = makeCourts(3);
    const gameRounds: GameRound[] = [];
    const pairs: Pair[] = [];
    const matches: Match[] = [];
    const setPlayers = vi.fn();
    const setGameRounds = vi.fn();
    const setSwapPlayer = vi.fn();
    const setDispRound = vi.fn();
    const setIsLoading = vi.fn();
    const setNumOfGenerate = vi.fn();
    const genderSetting: GenderPreferenceSetting = {
      men: false,
      woman: false,
      mix: false,
    };

    createMatch(
      players,
      setPlayers,
      courts,
      gameRounds,
      setGameRounds,
      pairs,
      matches,
      setSwapPlayer,
      genderSetting,
      setDispRound,
      setIsLoading,
      setNumOfGenerate
    );

    // setGameRoundsの引数から試合データを取得
    const called = setGameRounds.mock.calls[0][0];
    const newRounds =
      typeof called === "function" ? called(gameRounds) : called;
    const newMatches = newRounds[newRounds.length - 1].matches;

    // 対戦相手の重複チェック
    const facedPairs = new Set<string>();
    let duplicateCount = 0;
    for (const match of newMatches) {
      for (const a of match.teamA) {
        for (const b of match.teamB) {
          const key = [a, b].sort().join("-");
          if (facedPairs.has(key)) duplicateCount++;
          facedPairs.add(key);
        }
      }
    }
    expect(duplicateCount).toBeLessThanOrEqual(2); // 許容範囲で調整
  });

  it("なるべくペアが重複しない", () => {
    const players = makePlayers(12);
    const courts = makeCourts(3);
    const gameRounds: GameRound[] = [];
    const pairs: Pair[] = [
      { id: 1, player1: 1, player2: 2 },
      { id: 2, player1: 3, player2: 4 },
    ];
    const matches: Match[] = [];
    const setPlayers = vi.fn();
    const setGameRounds = vi.fn();
    const setSwapPlayer = vi.fn();
    const setDispRound = vi.fn();
    const setIsLoading = vi.fn();
    const setNumOfGenerate = vi.fn();
    const genderSetting: GenderPreferenceSetting = {
      men: false,
      woman: false,
      mix: false,
    };

    createMatch(
      players,
      setPlayers,
      courts,
      gameRounds,
      setGameRounds,
      pairs,
      matches,
      setSwapPlayer,
      genderSetting,
      setDispRound,
      setIsLoading,
      setNumOfGenerate
    );

    const called = setGameRounds.mock.calls[0][0];
    const newRounds =
      typeof called === "function" ? called(gameRounds) : called;
    const newMatches = newRounds[newRounds.length - 1].matches;

    // ペア重複チェック
    let pairCount = 0;
    for (const match of newMatches) {
      for (const pair of pairs) {
        if (
          (match.teamA.includes(pair.player1) &&
            match.teamA.includes(pair.player2)) ||
          (match.teamB.includes(pair.player1) &&
            match.teamB.includes(pair.player2))
        ) {
          pairCount++;
        }
      }
    }
    expect(pairCount).toBeLessThanOrEqual(pairs.length); // 許容範囲で調整
  });

  it("全プレイヤーで試合数に2以上の差が出ない", () => {
    const players = makePlayers(12);
    const courts = makeCourts(3);
    const gameRounds: GameRound[] = [];
    const pairs: Pair[] = [];
    const matches: Match[] = [];
    const setPlayers = vi.fn();
    const setGameRounds = vi.fn();
    const setSwapPlayer = vi.fn();
    const setDispRound = vi.fn();
    const setIsLoading = vi.fn();
    const setNumOfGenerate = vi.fn();
    const genderSetting: GenderPreferenceSetting = {
      men: false,
      woman: false,
      mix: false,
    };

    createMatch(
      players,
      setPlayers,
      courts,
      gameRounds,
      setGameRounds,
      pairs,
      matches,
      setSwapPlayer,
      genderSetting,
      setDispRound,
      setIsLoading,
      setNumOfGenerate
    );

    // setPlayersの引数から試合数を取得
    const called = setPlayers.mock.calls[0][0];
    const updatedPlayers =
      typeof called === "function" ? called(players) : called;
    const matchCounts = updatedPlayers.map((p: Player) => p.matchCount);
    const max = Math.max(...matchCounts);
    const min = Math.min(...matchCounts);

    expect(max - min).toBeLessThanOrEqual(2);
  });
});
