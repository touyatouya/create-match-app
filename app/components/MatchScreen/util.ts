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
  const partitions = getRandomGroupPartitions(
    [...requiredPlayers, ...optionalPlayers],
    300,
    courts
  );

  // ランダムに並び替え
  const limitedPartitions = partitions.sort(() => Math.random() - 0.5);

  let bestSets: GameRound[] = [];
  let bestScore = -Infinity;

  for (const courtSet of limitedPartitions) {
    const allTeamSplitSets = courtSet.map((group) =>
      group.length === 4 ? getTeamSplits(group) : [{ teamA: [], teamB: [] }]
    );

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
      const total = sets.reduce((acc, curr) => acc * curr.length, 1);
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

    // 計算量削減のため500個に制限
    const allCourtTeamCombinations = combineLimited(allTeamSplitSets, 300);

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

      // 必須プレイヤーが全員含まれていなければスキップ
      const allPlayersInThisSet = courtTeams.flatMap((team) => [
        ...team.teamA,
        ...team.teamB,
      ]);
      const isAllRequiredPresent = requiredPlayers.every((rp) =>
        allPlayersInThisSet.includes(rp)
      );
      if (!isAllRequiredPresent) continue;

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

// 12人を3グループに分割（各グループ4人）
const getRandomGroupPartitions = (
  players: number[],
  trials = 100,
  courts: Court[]
): number[][][] => {
  const results: number[][][] = [];
  const seen = new Set<string>();

  for (let i = 0; i < trials; i++) {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const groups = Array.from({ length: courts.length }, (_, idx) =>
      shuffled.slice(idx * 4, (idx + 1) * 4)
    );

    if (groups.every((g) => g.length === 4)) {
      const key = groups
        .map((g) => [...g].sort((a, b) => a - b).join(","))
        .sort()
        .join("|");

      if (!seen.has(key)) {
        seen.add(key);
        results.push(groups);
      }
    }
  }

  return results;
};

// 各4人グループをチーム分け（2人＋2人のダブルス）
export const getTeamSplits = (
  group: number[]
): { teamA: number[]; teamB: number[] }[] => {
  const pairs = getCombinations(group, 2);
  const teamPairs: { teamA: number[]; teamB: number[] }[] = [];

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

// n個の中からk個を選ぶすべての組み合わせ
export function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]]; // ベースケース：0個選ぶ → 空の組み合わせ [[]]
  if (arr.length < k) return []; // 要素数が足りなければ不可能 → []

  const [first, ...rest] = arr; // 配列の先頭要素と残りに分割

  // 1. first を使う組み合わせ
  const withFirst = getCombinations(rest, k - 1).map((comb) => [
    first,
    ...comb,
  ]);

  // 2. first を使わない組み合わせ
  const withoutFirst = getCombinations(rest, k);

  // 両方を統合して返す
  return [...withFirst, ...withoutFirst];
}

export const getPlayerName = (id: number, players: Player[]) => {
  return players.find((player) => player.id === id)?.name;
};
