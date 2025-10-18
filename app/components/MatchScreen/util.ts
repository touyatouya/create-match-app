import {
  Court,
  GameRound,
  Gender,
  GenderPreferenceSetting,
  Match as MatchType,
  Pair,
  Player,
} from "@/types";

export const createMatch = (
  players: Player[],
  setPlayers: (value: React.SetStateAction<Player[]>) => void,
  courts: Court[],
  gameRounds: GameRound[],
  setGameRounds: (value: React.SetStateAction<GameRound[]>) => void,
  pairs: Pair[],
  matches: MatchType[],
  setSwapPlayer: React.Dispatch<React.SetStateAction<number | null>>,
  genderSetting: GenderPreferenceSetting,
  setDispRound: React.Dispatch<React.SetStateAction<number>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setNumOfGenerate: React.Dispatch<React.SetStateAction<number>>
): void => {
  const sortedPlayer: Player[] = players
    .filter((player) => player.isJoin && !player.isRest)
    .sort((a, b) => a.matchCount - b.matchCount);

  let separatedPlayers: Player[][] = [];
  let matchCountSeparete_i = 0;
  for (let player_i = 0; player_i < sortedPlayer.length; player_i++) {
    if (
      player_i !== 0 &&
      sortedPlayer[player_i - 1].matchCount < sortedPlayer[player_i].matchCount
    ) {
      matchCountSeparete_i++;
    }
    if (separatedPlayers[matchCountSeparete_i] == null)
      separatedPlayers[matchCountSeparete_i] = [];
    separatedPlayers[matchCountSeparete_i].push(sortedPlayer[player_i]);
  }

  // priorityPlayersには、試合回数がnormalPlayersより1以上少なく、コート数×4人より少ない人数が入る
  let priorityPlayers: Player[] = [];
  let normalPlayers: Player[] = [];
  for (let i = 0; i < separatedPlayers.length; i++) {
    if (normalPlayers.length > 0) {
      priorityPlayers = [...priorityPlayers, ...normalPlayers];
      normalPlayers = [];
    }
    normalPlayers = [...separatedPlayers[i]];

    if (priorityPlayers.length + normalPlayers.length >= courts.length * 4)
      break;
  }

  const gameRound: GameRound = selectBestGameRounds(
    priorityPlayers.map((player) => player.id),
    normalPlayers.map((player) => player.id),
    courts,
    gameRounds,
    pairs,
    matches,
    players,
    genderSetting
  );

  if (gameRound == null) return;

  let prevGameRounds = gameRounds.length;
  setGameRounds((prev) => {
    return [...prev, gameRound];
  });

  const preMatches: MatchType[] = gameRounds.flatMap(
    (gameRound) => gameRound.matches
  );
  countMatch([...preMatches, ...gameRound.matches], players, setPlayers);
  setSwapPlayer(null);
  setDispRound(prevGameRounds + 1);
  setNumOfGenerate((prev) => prev + 1);
};

// スコアの高いコート構成を選ぶ関数
export function selectBestGameRounds(
  requiredPlayers: number[],
  optionalPlayers: number[],
  courts: Court[],
  gameRounds: GameRound[],
  pairs: Pair[],
  matches: MatchType[],
  players: Player[],
  genderSetting: GenderPreferenceSetting
): GameRound {
  const totalNeeded = courts.length * 4;
  const neededOptionalCount = totalNeeded - requiredPlayers.length;

  // 必須参加者が多すぎる場合はランダムに減らす
  if (requiredPlayers.length > totalNeeded) {
    requiredPlayers = shuffle(requiredPlayers).slice(0, totalNeeded);
  }

  // 任意参加者が多すぎる場合はランダムに減らす
  if (optionalPlayers.length > neededOptionalCount) {
    optionalPlayers = shuffle(optionalPlayers).slice(0, neededOptionalCount);
  }

  // partitionsは、[[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], ...]
  const partitions = getRandomGroupPartitions(
    [...requiredPlayers, ...optionalPlayers],
    50,
    courts
  );

  let bestSets: GameRound[] = [];
  let bestScore = -Infinity;

  // // courtSetは、[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
  for (const courtSet of partitions) {
    // allTeamSplitSetsは、[
    //   [{teamA: [1,2], teamB: [3,4]}, {teamA: [1,3], teamB: [2,4]}, ...],
    //   [{teamA: [5,6], teamB: [7,8]}, {teamA: [5,7], teamB: [6,8]}, ...],
    //   ...
    // ]
    // 各コートの4人グループを2人ずつのチームに分割するすべての組み合わせを取得
    const allTeamSplitSets = courtSet.map((group) =>
      group.length === 4 ? getTeamSplits(group) : [{ teamA: [], teamB: [] }]
    );

    // 計算量削減のため100個に制限
    // allCourtTeamCombinationsは、[
    //   [{teamA: [1,2], teamB: [3,4]}, {teamA: [5,6], teamB: [7,8]}, {teamA: [9,10], teamB: [11,12]}],
    //   [{teamA: [1,3], teamB: [2,4]}, {teamA: [5,6], teamB: [7,8]}, {teamA: [9,10], teamB: [11,12]}],
    //   ...
    // ]
    // 各コートから1つずつチーム分けを選んだ組み合わせを取得
    const allCourtTeamCombinations = combineLimited(allTeamSplitSets, 100);

    for (const courtTeams of allCourtTeamCombinations) {
      const gameRound: GameRound = {
        id:
          gameRounds.length > 0 ? gameRounds[gameRounds.length - 1].id + 1 : 0,
        matches: courtTeams.map((team, index) => ({
          id: index,
          courtId: courts[index].id,
          teamA: team.teamA,
          teamB: team.teamB,
        })),
      };

      // すべてのペアが同じチーム、両方とも休憩、片方休憩のいずれかになっているかをチェック
      const areAllPairsValid = pairs.every((pair) => {
        const isPlayer1 = courtTeams.find(
          (team) =>
            team.teamA.includes(pair.player1) ||
            team.teamB.includes(pair.player1)
        );

        const isPlayer2 = courtTeams.find(
          (team) =>
            team.teamA.includes(pair.player2) ||
            team.teamB.includes(pair.player2)
        );

        if (!isPlayer1 && !isPlayer2) return true; // どちらもいない場合はOK
        if (isPlayer1 && !isPlayer2) return true; // 片方しかいない場合はOK
        if (!isPlayer1 && isPlayer2) return true; // 片方しかいない場合はOK

        return courtTeams.some((team) => {
          const aHas1 = team.teamA.includes(pair.player1);
          const aHas2 = team.teamA.includes(pair.player2);
          const bHas1 = team.teamB.includes(pair.player1);
          const bHas2 = team.teamB.includes(pair.player2);

          const sameInA = aHas1 && aHas2;
          const sameInB = bHas1 && bHas2;

          return sameInA || sameInB;
        });
      });

      if (!areAllPairsValid) continue;

      const totalScore = courtTeams.reduce((acc, team) => {
        return (
          acc +
          (team.teamA.length + team.teamB.length < 2
            ? 0
            : scoreMatch(team, matches) +
              scoreGender(team, players, genderSetting))
        );
      }, 0);

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestSets = [gameRound];
      } else if (totalScore === bestScore) {
        bestSets.push(gameRound);
      }
    }
  }

  return bestSets[Math.floor(Math.random() * bestSets.length)];
}

export const countMatch = (
  newMatches: MatchType[],
  players: Player[],
  setPlayers: (value: React.SetStateAction<Player[]>) => void
): void => {
  // プレイヤー毎の試合数カウント
  const playedPlayerIds: number[] = newMatches.flatMap((match) => [
    ...match.teamA,
    ...match.teamB,
  ]);

  const matchCountedPlayers: Player[] = players.map((player) => {
    return {
      ...player,
      matchCount: playedPlayerIds.filter((item) => item === player.id).length,
    };
  });

  setPlayers(matchCountedPlayers);
};

export const countPairedBefore = (
  player1: number,
  player2: number,
  matches: MatchType[]
) => {
  const joinedTeamAMatches = matches.filter((match) =>
    match.teamA.includes(player1)
  );
  const joinedTeamBMatches = matches.filter((match) =>
    match.teamB.includes(player1)
  );

  return (
    joinedTeamAMatches.filter((match) => match.teamA.includes(player2)).length +
    joinedTeamBMatches.filter((match) => match.teamB.includes(player2)).length
  );
};

const countFacedBefore = (
  player1: number,
  player2: number,
  matches: MatchType[]
) => {
  const joinedTeamAMatches = matches.filter((match) =>
    match.teamA.includes(player1)
  );
  const joinedTeamBMatches = matches.filter((match) =>
    match.teamB.includes(player1)
  );

  return (
    joinedTeamAMatches.filter((match) => match.teamB.includes(player2)).length +
    joinedTeamBMatches.filter((match) => match.teamA.includes(player2)).length
  );
};

/**
 * 指定されたプレイヤーをランダムにグループ分けし、ユニークなグループ構成を生成します。
 *
 * @param {number[]} players - グループ分けするプレイヤーのIDリスト。
 * @param {number} [trials=100] - 試行回数。生成するグループ構成の最大数。
 * @param {Court[]} courts - 使用するコートのリスト。各コートに4人ずつ割り当てられる。
 * @returns {number[][][]} - グループ分けされたプレイヤーIDのリスト。各グループはコートごとに分割される。
 *
 * @example
 * // 出力例: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], ...]
 */
const getRandomGroupPartitions = (
  players: number[],
  trials = 50,
  courts: Court[]
): number[][][] => {
  const results: number[][][] = [];
  const seen = new Set<string>();

  // 十分な人数がいない場合は空配列を返す
  if (players.length < courts.length * 4) return results;

  for (let i = 0; i < trials; i++) {
    const shuffled = shuffle(players);

    // [[1,2,3,4], [5,6,7,8], [9,10,11,12]]のようにコート数*4人ずつのグループに分ける
    const groups = Array.from({ length: courts.length }, (_, idx) =>
      shuffled.slice(idx * 4, (idx + 1) * 4)
    );

    // "1,2,3,4|5,6,7,8|9,10,11,12" というユニークキーを作る
    // これにより、「順番が違うだけの同じ組み合わせ」を除外できる
    const key = groups
      .map((g) => [...g].sort((a, b) => a - b).join(","))
      .sort()
      .join("|");

    if (!seen.has(key)) {
      seen.add(key);
      results.push(groups);
    }
  }

  return results;
};

// 1/n!の確率で配列をシャッフル
export const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array]; // 元の配列は破壊しない
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * 各セットから1つずつ選択して、可能な組み合わせを生成します。
 * 組み合わせの数は指定された制限値以内に抑えられます。
 *
 * @param {{ teamA: number[]; teamB: number[] }[][]} sets - 各セットの選択肢の配列。
 * @param {number} limit - 生成する組み合わせの最大数。
 * @returns {{ teamA: number[]; teamB: number[] }[][]} - 生成された組み合わせの配列。
 *
 * @example
 * const sets = [
 *   [{ teamA: [1, 2], teamB: [3, 4] }, { teamA: [1, 3], teamB: [2, 4] }],
 *   [{ teamA: [5, 6], teamB: [7, 8] }, { teamA: [5, 7], teamB: [6, 8] }]
 * ];
 * const combinations = combineLimited(sets, 3);
 * // 出力例: [
 * //   [{ teamA: [1, 2], teamB: [3, 4] }, { teamA: [5, 6], teamB: [7, 8] }],
 * //   [{ teamA: [1, 3], teamB: [2, 4] }, { teamA: [5, 6], teamB: [7, 8] }],
 * //   [{ teamA: [1, 2], teamB: [3, 4] }, { teamA: [5, 7], teamB: [6, 8] }]
 * // ]
 */
const combineLimited = (
  sets: {
    teamA: number[];
    teamB: number[];
  }[][],
  limit: number
): {
  teamA: number[];
  teamB: number[];
}[][] => {
  const results: { teamA: number[]; teamB: number[] }[][] = [];
  // 組み合わせの総数を計算
  const total = sets.reduce((acc, curr) => acc * curr.length, 1);
  // 生成する組み合わせの数を制限
  const maxTry = Math.min(total, limit);

  const getRandomIndex = (n: number) => Math.floor(Math.random() * n);

  for (let i = 0; i < maxTry; i++) {
    const combo = sets.map(
      (options) => options[getRandomIndex(options.length)]
    );
    results.push(combo);
  }

  return results;
};

/**
 * 4人グループを2人ずつのチームに分割するすべての組み合わせを生成します。
 *
 * @param {number[]} group - 4人のプレイヤーIDの配列。
 * @returns {{ teamA: number[]; teamB: number[] }[]} - チームAとチームBに分割されたすべての組み合わせ。
 *
 * @example
 * // 出力例: [
 * //   { teamA: [1, 2], teamB: [3, 4] },
 * //   { teamA: [1, 3], teamB: [2, 4] },
 * //   { teamA: [1, 4], teamB: [2, 3] },
 * //   ...
 * // ]
 */
export const getTeamSplits = (
  group: number[]
): { teamA: number[]; teamB: number[] }[] => {
  // parisは、[[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]のような形
  const pairs = getCombinations(group, 2);
  const teamPairs: { teamA: number[]; teamB: number[] }[] = [];

  // 各ペアに対して、残りの2人をもう一方のチームに割り当てる
  for (const teamA of pairs) {
    const teamB = group.filter((p) => !teamA.includes(p));
    teamPairs.push({ teamA, teamB });
  }

  return teamPairs;
};

// なるべく異なる人と試合すると高得点
export const scoreMatch = (
  match: {
    teamA: number[];
    teamB: number[];
  },
  matches: MatchType[]
): number => {
  let score = 0;

  // 味方との過去の組み合わせが多いほど減点
  for (const p1 of match.teamA) {
    for (const p2 of match.teamA) {
      if (p1 !== p2) {
        const count = countPairedBefore(p1, p2, matches);
        score += count * -1;
      }
    }
  }
  // 相手との過去の対戦が多いほどさらに減点（優先度高）
  for (const p1 of match.teamA) {
    for (const p2 of match.teamB) {
      const count = countFacedBefore(p1, p2, matches);
      score += count * -1;
    }
  }

  return score;
};

// 性別設定に沿った組み合わせだと高得点
export const scoreGender = (
  team: {
    teamA: number[];
    teamB: number[];
  },
  players: Player[],
  genderSetting: GenderPreferenceSetting
): number => {
  if (!genderSetting.men && !genderSetting.woman && !genderSetting.mix)
    return 0;
  const teamAGenders = team.teamA.map(
    (id) => players.find((p) => p.id === id)?.gender ?? Gender.未設定
  );
  const teamBGenders = team.teamB.map(
    (id) => players.find((p) => p.id === id)?.gender ?? Gender.未設定
  );
  const teamAMale = teamAGenders.filter((g) => g === "男性").length;
  const teamAFemale = teamAGenders.filter((g) => g === "女性").length;
  const teamBMale = teamBGenders.filter((g) => g === "男性").length;
  const teamBFemale = teamBGenders.filter((g) => g === "女性").length;

  let score = 0;

  if (
    genderSetting.mix &&
    teamAMale === 1 &&
    teamAFemale === 1 &&
    teamBMale === 1 &&
    teamBFemale === 1
  ) {
    score += 3;
  }
  if (genderSetting.men && teamAMale === 2 && teamBMale === 2) {
    score += 3;
  }
  if (genderSetting.woman && teamAFemale === 2 && teamBFemale === 2) {
    score += 3;
  }

  return score;
};

/**
 * 配列から指定された数の要素を選ぶすべての組み合わせを生成します。
 *
 * @template T - 配列の要素の型。
 * @param {T[]} arr - 組み合わせを生成する元の配列。
 * @param {number} k - 選択する要素の数。
 * @returns {T[][]} - 生成されたすべての組み合わせの配列。
 *
 * @example
 * const items = [1, 2, 3];
 * const combinations = getCombinations(items, 2);
 * console.log(combinations);
 * // 出力例: [[1, 2], [1, 3], [2, 3]]
 */
export const getCombinations = <T>(arr: T[], k: number): T[][] => {
  if (k === 0) return [[]]; // 0個選ぶ → 空の組み合わせ
  if (arr.length < k) return []; // 足りなければ []

  const [first, ...rest] = arr;

  // first を使う組み合わせ
  const withFirst = getCombinations(rest, k - 1).map((comb) => [
    first,
    ...comb,
  ]);

  // first を使わない組み合わせ
  const withoutFirst = getCombinations(rest, k);

  return [...withFirst, ...withoutFirst];
};

export const getPlayerName = (id: number, players: Player[]) => {
  return players.find((player) => player.id === id)?.name;
};
