import { generateUniqId } from "@/utils/createId";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
// import analytics from "@react-native-firebase/analytics";
import React from "react";
import {
  Court,
  GameRound,
  Gender,
  GenderPreferenceSetting,
  GenerateMode,
  Match as MatchType,
  Pair,
  Player,
} from "../../../types";

export const createMatch = async (
  players: Player[],
  setPlayers: (value: React.SetStateAction<Player[]>) => void,
  courts: Court[],
  gameRounds: GameRound[],
  setGameRounds: (value: React.SetStateAction<GameRound[]>) => void,
  pairs: Pair[],
  matches: MatchType[],
  dispRound: number,
  genareteMode: GenerateMode,
  setSwapPlayer: React.Dispatch<React.SetStateAction<number | null>>,
  genderSetting: GenderPreferenceSetting,
  isAdjustMatchCount: boolean,
  isPreferMatchCountOverPair: boolean,
  setDispRound: React.Dispatch<React.SetStateAction<number>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setNewGames: React.Dispatch<React.SetStateAction<MatchType["id"][]>>,
): Promise<void> => {
  const notFinishedMatches =
    genareteMode === GenerateMode.REPLACE_ALL
      ? []
      : matches.filter((match) => !match.canInsertNext);

  const playingPlayer = notFinishedMatches.flatMap((match) => [
    ...match.teamA,
    ...match.teamB,
  ]);
  const sortedPlayer: Player[] = players
    .filter(
      (player) =>
        player.isJoin &&
        !player.isRest &&
        (playingPlayer == null ||
          playingPlayer.length === 0 ||
          !playingPlayer.includes(player.id)),
    )
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

  const playingCourtIds = gameRounds
    .flatMap((gameRound) => gameRound.matches)
    .filter((match) =>
      genareteMode === GenerateMode.REPLACE_ALL ? false : !match.canInsertNext,
    )
    .flatMap((match) => match.courtId);

  const avaibleCourts =
    genareteMode === GenerateMode.FILL_ENPTY
      ? courts.filter(
          (court) =>
            playingCourtIds == null ||
            playingCourtIds.length === 0 ||
            !playingCourtIds.includes(court.id),
        )
      : courts;

  const totalNeeded =
    avaibleCourts.length * 4 -
    gameRounds
      .flatMap((round) => round.matches)
      .filter((match) => match.teamA.length + match.teamB.length < 4)
      .flatMap((match) => [...match.teamA, ...match.teamB]).length;

  // priorityPlayersには、試合回数がnormalPlayersより1以上少なく、コート数×4人より少ない人数が入る
  let priorityPlayers: Player[] = [];
  let normalPlayers: Player[] = [];
  for (let i = 0; i < separatedPlayers.length; i++) {
    if (normalPlayers.length > 0) {
      priorityPlayers = [...priorityPlayers, ...normalPlayers];
      normalPlayers = [];
    }
    normalPlayers = [...separatedPlayers[i]];
    if (!isPreferMatchCountOverPair) {
      const normalPlayerIds = normalPlayers.map((p) => p.id);
      const otherPlayerIds = players
        .filter((player) => !normalPlayerIds.includes(player.id))
        .map((p) => p.id);
      const pairPlayerIds = findPairedPlayers(
        otherPlayerIds,
        normalPlayerIds,
        pairs,
      );
      const pairPlayers = players.filter((p) => pairPlayerIds.includes(p.id));
      normalPlayers = [...normalPlayers, ...pairPlayers];
    }

    if (priorityPlayers.length + normalPlayers.length >= totalNeeded) break;
  }

  const gameRound: GameRound = selectBestGameRounds(
    priorityPlayers.map((player) => player.id),
    normalPlayers.map((player) => player.id),
    avaibleCourts,
    gameRounds,
    pairs,
    matches,
    players,
    genderSetting,
    isPreferMatchCountOverPair,
  );

  if (gameRound == null) return;

  let prevGameRounds = gameRounds.length;
  let updatedGameRounds = gameRounds.length;
  let newGameRounds: GameRound[] = [];

  setGameRounds((prev) => {
    if (genareteMode === GenerateMode.REPLACE_ALL) {
      const updatedPrev = prev
        .map((gameRound) => {
          return {
            ...gameRound,
            matches: gameRound.matches.map((match) => ({
              ...match,
              isFinished: true,
              canInsertNext: true,
            })),
          };
        })
        .filter((gr) => gr.matches.length > 0);
      updatedGameRounds = updatedPrev.length;

      newGameRounds = [...updatedPrev, gameRound];
      return newGameRounds;
    } else {
      const updatedPrev = prev
        .map((gameRound) => {
          return {
            ...gameRound,
            matches: gameRound.matches.map((match) => ({
              ...match,
              isFinished: match.canInsertNext,
              canInsertNext: match.canInsertNext,
            })),
          };
        })
        .filter((gr) => gr.matches.length > 0);
      updatedGameRounds = updatedPrev.length;
      newGameRounds = [...updatedPrev, gameRound];
      return newGameRounds;
    }
  });

  const newMatches: MatchType[] = newGameRounds.flatMap(
    (gameRound) => gameRound.matches,
  );
  const newPlayers = countMatch(newMatches, players, setPlayers);
  setSwapPlayer(null);
  if (prevGameRounds === 0 || prevGameRounds <= updatedGameRounds) {
    setDispRound(prevGameRounds + 1);
  }

  const newIds = gameRound.matches.map((m) => m.id);
  setNewGames(newIds);

  await clearGameData();
  await saveGameData({
    gameRounds: newGameRounds,
    courts,
    generateMode: genareteMode,
    recentPlayers: newPlayers,
    anonymousPlayerCount: newPlayers.filter((p) => p.isAnonymous).length,
    pairs,
    genderSetting,
    isPreferMatchCountOverPair,
    saveAt: new Date().getTime(),
  });

  // await analytics().logEvent("match_generated", {
  //   player_count: players.length,
  //   anonymous_player_: players.filter((p) => p.isAnonymous).length,
  //   noAnonymous_player_: players.filter((p) => !p.isAnonymous).length,
  //   court_count: courts.length,
  //   game_count: newGameRounds.length,
  //   match_count: matches.length,
  //   generateMode: genareteMode,
  //   pairs: pairs.length,
  //   genderMen: genderSetting.men,
  //   genderWoman: genderSetting.woman,
  //   genderMix: genderSetting.mix,
  //   version: Constants.expoConfig?.version,
  // });
};

// スコアの高いコート構成を選ぶ関数
export function selectBestGameRounds(
  requiredPlayers: number[],
  optionalPlayers: number[],
  courts: Court[],
  initialGameRounds: GameRound[],
  pairs: Pair[],
  matches: MatchType[],
  players: Player[],
  genderSetting: GenderPreferenceSetting,
  isPreferMatchCountOverPair: boolean,
): GameRound {
  const totalNeeded = courts.length * 4;

  // 最終的な任意参加者を決定
  const joinedPlayers = getJoinPlayers(
    requiredPlayers,
    optionalPlayers,
    pairs,
    totalNeeded,
    isPreferMatchCountOverPair,
  );

  // 参加者の中のペアを抽出
  const joinedPairs = pairs.filter(
    (pair) =>
      joinedPlayers.includes(pair.player1) &&
      joinedPlayers.includes(pair.player2),
  );

  // partitionsは、[[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], ...]
  const partitions = getRandomGroupPartitions(
    [...joinedPlayers],
    50,
    courts,
    joinedPairs,
    initialGameRounds,
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
    const allTeamSplitSets = courtSet.map((group) => {
      return group.length === 4
        ? getTeamSplits(
            group,
            joinedPairs.filter(
              (pair) =>
                group.includes(pair.player1) && group.includes(pair.player2),
            ),
            { teamA: [], teamB: [] },
          )
        : [{ teamA: [], teamB: [] }];
    });

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
          initialGameRounds.length > 0
            ? initialGameRounds[initialGameRounds.length - 1].id + 1
            : 0,
        matches: courtTeams.map((team, index) => ({
          id: generateUniqId(matches.map((m) => m.id)),
          courtId: courts[index].id,
          teamA: team.teamA,
          teamB: team.teamB,
          isFinished: false,
          canInsertNext: false,
          finishRound: null,
        })),
      };

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

const getJoinPlayers = (
  requiredPlayers: number[],
  optionalPlayers: number[],
  pairs: Pair[],
  totalNeeded: number,
  isPreferMatchCountOverPair: boolean,
): number[] => {
  if (requiredPlayers.length === 0 && optionalPlayers.length === totalNeeded)
    return [...optionalPlayers];
  if (requiredPlayers.length + optionalPlayers.length === totalNeeded)
    return [...requiredPlayers, ...optionalPlayers];

  // 必須はまず確定
  const result: number[] = [...requiredPlayers];
  const needCount = Math.max(0, totalNeeded - result.length);
  if (needCount === 0) return result.slice(0, totalNeeded);

  // ペアのマップを作る
  const partnerMap = new Map<number, number>();
  for (const p of pairs) {
    partnerMap.set(p.player1, p.player2);
    partnerMap.set(p.player2, p.player1);
  }

  if (!isPreferMatchCountOverPair) {
    // resultの要素数が奇数の場合
    if (result.length % 2 === 1) {
      // optionalPlayers からペアを持たないプレイヤーをランダムに1人追加して偶数にする
      const optionalWithoutPair = optionalPlayers.filter(
        (p) => !partnerMap.has(p),
      );
      if (optionalWithoutPair.length > 0) {
        const randIndex = Math.floor(
          Math.random() * optionalWithoutPair.length,
        );
        const selectedPlayer = optionalWithoutPair[randIndex];
        result.push(selectedPlayer);
      } else {
        // requiredPlayersのうちペアがいないプレイヤーをランダムに1人除外して偶数にする
        const requiredWithoutPair = requiredPlayers.filter(
          (p) => !partnerMap.has(p),
        );
        const randIndex = Math.floor(
          Math.random() * requiredWithoutPair.length,
        );
        const removedPlayer = requiredWithoutPair[randIndex];
        const removedIndex = result.indexOf(removedPlayer);
        if (removedIndex !== -1) {
          result.splice(removedIndex, 1);
        }
      }
    }

    // optional 内のペア、もしくはペア無しoptional2人どちらかをランダムに追加していく
    while (result.length < totalNeeded) {
      const canAddPairs: Pair[] = [];
      // optional 内のペアを抽出
      for (const pair of pairs) {
        if (
          optionalPlayers.includes(pair.player1) &&
          optionalPlayers.includes(pair.player2) &&
          !result.includes(pair.player1) &&
          !result.includes(pair.player2)
        ) {
          canAddPairs.push(pair);
        }
      }
      // optional 内のペアを持たないプレイヤーを抽出
      const canAddSingles = optionalPlayers.filter(
        (p) => !result.includes(p) && !partnerMap.has(p),
      );

      if (canAddSingles.length < 2 && canAddPairs.length > 0) {
        const randIndex = Math.floor(Math.random() * canAddPairs.length);
        const selectedPair = canAddPairs[randIndex];
        result.push(selectedPair.player1, selectedPair.player2);
        continue;
      } else if (canAddSingles.length >= 2 && canAddPairs.length === 0) {
        const shuffledSingles = shuffle(canAddSingles);
        const selectedSingles = shuffledSingles.slice(0, 2);
        for (const single of selectedSingles) {
          result.push(single);
        }
        continue;
      } else {
        // ランダムにどちらかを選択して追加
        const choosePair = Math.random() < 0.5;
        if (choosePair) {
          const randIndex = Math.floor(Math.random() * canAddPairs.length);
          const selectedPair = canAddPairs[randIndex];
          result.push(selectedPair.player1, selectedPair.player2);
          continue;
        } else {
          const shuffledSingles = shuffle(canAddSingles);
          const selectedSingles = shuffledSingles.slice(0, 2);
          for (const single of selectedSingles) {
            result.push(single);
          }
          continue;
        }
      }
    }

    return result.slice(0, totalNeeded);
  } else {
    const pairPlayerOptionals = optionalPlayers.filter((p) => {
      const partner = partnerMap.get(p);
      return partner != null && requiredPlayers.includes(partner);
    });
    for (const p of pairPlayerOptionals) {
      result.push(p);
      if (result.length >= totalNeeded) break;
    }
    // optional 内のペア、もしくはペア無しoptional2人どちらかをランダムに追加していく
    while (result.length < totalNeeded) {
      // requiredPlayers側でペアを持つプレイヤーがいる場合、そのペアを優先的に追加する
      const canAddPairs: Pair[] = [];
      // optional 内のペアを抽出
      for (const pair of pairs) {
        if (
          optionalPlayers.includes(pair.player1) &&
          optionalPlayers.includes(pair.player2) &&
          !result.includes(pair.player1) &&
          !result.includes(pair.player2)
        ) {
          canAddPairs.push(pair);
        }
      }
      // optional 内のペアを持たないプレイヤーを抽出
      const canAddSingles = optionalPlayers.filter(
        (p) => !result.includes(p) && !partnerMap.has(p),
      );

      // optionalでペアがoptionalにもrequiredにも存在しないプレイヤーを抽出
      const optionalWithoutPair = optionalPlayers.filter((p) => {
        const partner = partnerMap.get(p);
        return (
          partner != null &&
          !optionalPlayers.includes(partner) &&
          !requiredPlayers.includes(partner)
        );
      });

      if (
        totalNeeded - result.length >= 2 &&
        canAddPairs.length > 0 &&
        canAddSingles.length === 0
      ) {
        const randIndex = Math.floor(Math.random() * canAddPairs.length);
        const selectedPair = canAddPairs[randIndex];
        result.push(selectedPair.player1, selectedPair.player2);
        continue;
      } else if (
        canAddPairs.length === 0 &&
        canAddSingles.length === 0 &&
        optionalWithoutPair.length >= 1
      ) {
        const shuffledOptionalWithoutPair = shuffle(optionalWithoutPair);
        const selectedSingles = shuffledOptionalWithoutPair.slice(0, 2);
        for (const single of selectedSingles) {
          result.push(single);
        }
        continue;
      } else if (canAddPairs.length === 0 && canAddSingles.length >= 1) {
        const shuffledSingles = shuffle(canAddSingles);
        const selectedSingles = shuffledSingles[0];
        result.push(selectedSingles);
        continue;
      } else {
        // ランダムにどちらかを選択して追加
        const choosePair = Math.random() < 0.5;
        if (choosePair) {
          const randIndex = Math.floor(Math.random() * canAddPairs.length);
          const selectedPair = canAddPairs[randIndex];
          result.push(selectedPair.player1, selectedPair.player2);
          continue;
        } else {
          const shuffledSingles = shuffle(canAddSingles);
          const selectedSingles = shuffledSingles[0];
          result.push(selectedSingles);
          continue;
        }
      }
    }

    return result.slice(0, totalNeeded);
  }
};

/**
 * playersAの中で、playersBとペアになっているプレイヤーIDを抽出します。
 *
 * @param {number[]} playersA - 対象となるプレイヤーIDの配列。
 * @param {number[]} playersB - ペア相手として判定するプレイヤーIDの配列。
 * @param {Pair[]} pairs - ペア情報の配列。
 * @returns {number[]} - playersBとペアになっているplayersA側のプレイヤーID配列。
 *
 * @example
 * const playersA = [1, 2, 3];
 * const playersB = [4, 5];
 * const pairs = [{ player1: 1, player2: 4 }, { player1: 2, player2: 5 }];
 * const result = findPairedPlayers(playersA, playersB, pairs);
 * // result: [1, 2]
 */
export const findPairedPlayers = (
  playersA: number[],
  playersB: number[],
  pairs: Pair[],
): number[] => {
  const pairPlayers: number[] = [];

  // playersAの中で、playersBとペアになっているプレイヤーを探す
  for (const playerB of playersB) {
    for (const pair of pairs) {
      if (pair.player1 === playerB && playersA.includes(pair.player2)) {
        pairPlayers.push(pair.player2);
      } else if (pair.player2 === playerB && playersA.includes(pair.player1)) {
        pairPlayers.push(pair.player1);
      }
    }
  }

  return pairPlayers;
};

export const countMatch = (
  newMatches: MatchType[],
  players: Player[],
  setPlayers: (value: React.SetStateAction<Player[]>) => void,
): Player[] => {
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
  return matchCountedPlayers;
};

export const countPairedBefore = (
  player1: number,
  player2: number,
  matches: MatchType[],
) => {
  const joinedTeamAMatches = matches.filter((match) =>
    match.teamA.includes(player1),
  );
  const joinedTeamBMatches = matches.filter((match) =>
    match.teamB.includes(player1),
  );

  return (
    joinedTeamAMatches.filter((match) => match.teamA.includes(player2)).length +
    joinedTeamBMatches.filter((match) => match.teamB.includes(player2)).length
  );
};

const countFacedBefore = (
  player1: number,
  player2: number,
  matches: MatchType[],
) => {
  const joinedTeamAMatches = matches.filter((match) =>
    match.teamA.includes(player1),
  );
  const joinedTeamBMatches = matches.filter((match) =>
    match.teamB.includes(player1),
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
 * @param {Court[]} [courts=[]] - 利用可能なコートのリスト。グループ数の基準として使用。
 * @param {Pair[]} [pairs=[]] - ペアとして扱うプレイヤーのペアリスト。
 * @param {GameRound[]} [initialGameRounds=[]] - 初期のゲームラウンド情報。未完了の試合から不完全なグループを抽出。
 * @returns {number[][][]} - グループ分けされたプレイヤーIDのリスト。各グループはコートごとに分割される。
 *
 * @example
 * // 出力例: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], ...]
 */
const getRandomGroupPartitions = (
  players: number[],
  trials = 50,
  courts: Court[] = [],
  pairs: Pair[] = [],
  initialGameRounds: GameRound[] = [],
): number[][][] => {
  const results: number[][][] = [];
  const seen = new Set<string>();

  const initialGroups = initialGameRounds
    .flatMap((round) => round.matches)
    .filter((match) => match.teamA.length + match.teamB.length < 4)
    .map((match) => [...match.teamA, ...match.teamB]);

  // 十分な人数がいない場合は空配列を返す
  if (courts.length * 4 < players.length + initialGroups.flat().length) {
    return results;
  }

  for (let i = 0; i < trials; i++) {
    // [[player1, player2], [player3, player4], ...]の形に変換
    const pairPlayers: number[][] = pairs.map((pair) => [
      pair.player1,
      pair.player2,
    ]);
    const shuffledPairPlayers = shuffle(pairPlayers);
    // [player1, player2, ...]の形に変換
    const unPairPlayers: number[] = players.filter(
      (player) =>
        !pairs.some(
          (pair) => pair.player1 === player || pair.player2 === player,
        ),
    );
    const shuffledUnPairPlayers = shuffle(unPairPlayers);

    let groups: number[][] = initialGroups; // コートごとのグループを格納する配列　[[player1, player2, player3, player4], ...]

    for (let i = 0; groups.flat().length < courts.length * 4; i++) {
      let court: number[] = initialGroups[i] ? [...initialGroups[i]] : []; // 1コート分のプレイヤーを格納する配列 [player1, player2, player3, player4]
      while (court.length < 4) {
        const random = Math.random() - 0.5;
        // ペアがいなくなった、またはコートが3つ目の場合、またはランダム値が0以下の場合は、ペアではないプレイヤーをコートに追加
        if (
          shuffledPairPlayers.length === 0 ||
          court.length === 3 ||
          (shuffledUnPairPlayers[0] != null && random <= 0)
        ) {
          const headPlayer = shuffledUnPairPlayers.shift();
          court.push(headPlayer!);
          // ペアがいる場合、またはランダム値が0より大きい場合は、ペアのプレイヤーをコートに追加
        } else if (shuffledPairPlayers[0] != null && random > 0) {
          const headPlayer = shuffledPairPlayers.shift();
          court.push(...headPlayer!);
        }
      }
      // コートに4人揃ったらgroupsに追加
      if (court.length === 4) {
        groups[i] = court;
      }
    }

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
  limit: number,
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
      (options) => options[getRandomIndex(options.length)],
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
  group: number[],
  pairs: Pair[] = [],
  initialSplit: { teamA: number[]; teamB: number[] } = { teamA: [], teamB: [] },
): { teamA: number[]; teamB: number[] }[] => {
  const isInitialTeamA = initialSplit?.teamA?.length > 0;
  let isPair1TeamA = false;
  if (isInitialTeamA) {
    isPair1TeamA =
      pairs[0]?.player1 === initialSplit.teamA[0] ||
      pairs[0]?.player2 === initialSplit.teamA[0];
  }

  if (pairs.length === 2) {
    // ペアが2組いる場合、ペア同士でチームを分ける
    const pair1 = pairs[0];
    const pair2 = pairs[1];

    if (isInitialTeamA) {
      return [
        {
          teamA: [...initialSplit.teamA],
          teamB: isPair1TeamA
            ? [pair2.player1, pair2.player2]
            : [pair1.player1, pair1.player2],
        },
      ];
    }

    return [
      {
        teamA: [pair1.player1, pair1.player2],
        teamB: [pair2.player1, pair2.player2],
      },
    ];
  } else if (pairs.length === 1) {
    // ペアが1組いる場合、ペアとペアでない人でチームを分ける
    const pairPlayers = pairs.flatMap((pair) => [pair.player1, pair.player2]);
    const unPairPlayers = group.filter((p) => !pairPlayers.includes(p));
    const pair = pairs[0];

    if (initialSplit?.teamA?.length === 1) {
      return [
        {
          teamA: [
            ...initialSplit.teamA,
            unPairPlayers.find((p) => p !== initialSplit.teamA[0]) as number,
          ],
          teamB: [pair.player1, pair.player2],
        },
      ];
    } else if (initialSplit?.teamA?.length === 2) {
      return [
        {
          teamA: [...initialSplit.teamA],
          teamB: isPair1TeamA
            ? [unPairPlayers[0], unPairPlayers[1]]
            : [
                ...initialSplit.teamB,
                ...pairPlayers.filter((p) => !initialSplit.teamB.includes(p)),
              ],
        },
      ];
    }

    return [
      {
        teamA: [pair.player1, pair.player2],
        teamB: [unPairPlayers[0], unPairPlayers[1]],
      },
    ];
  } else {
    if (
      initialSplit?.teamA?.length === 1 &&
      initialSplit?.teamB?.length === 0
    ) {
      // すでにteamAに1人いる場合、残りの3人からteamAに1人、teamBに2人を割り当てる
      const remainingPlayers = group.filter((p) => p !== initialSplit.teamA[0]);
      const teamASplits = remainingPlayers.map((p) => [
        initialSplit.teamA[0],
        p,
      ]);
      const teamPairs: { teamA: number[]; teamB: number[] }[] = [];

      for (const teamA of teamASplits) {
        const teamB = remainingPlayers.filter((p) => !teamA.includes(p));
        teamPairs.push({ teamA, teamB });
      }

      return teamPairs;
    } else if (
      initialSplit.teamA?.length === 1 &&
      initialSplit.teamB?.length === 1
    ) {
      // すでにteamAとteamBに1人ずついる場合、残りの2人をそれぞれのチームに割り当てる
      const remainingPlayers = group.filter(
        (p) => p !== initialSplit.teamA[0] && p !== initialSplit.teamB[0],
      );
      const teamPairs: { teamA: number[]; teamB: number[] }[] = [];

      for (const p of remainingPlayers) {
        teamPairs.push({
          teamA: [initialSplit.teamA[0], p],
          teamB: [
            initialSplit.teamB[0],
            remainingPlayers.find((q) => q !== p) as number,
          ],
        });
      }

      return teamPairs;
    } else if (
      initialSplit.teamA?.length === 2 &&
      initialSplit.teamB?.length === 0
    ) {
      // すでにteamAに2人いる場合、残りの2人をteamBに割り当てる
      const remainingPlayers = group.filter(
        (p) => p !== initialSplit.teamA[0] && p !== initialSplit.teamA[1],
      );
      return [
        {
          teamA: [...initialSplit.teamA],
          teamB: [...remainingPlayers],
        },
      ];
    } else if (
      initialSplit.teamA?.length === 2 &&
      initialSplit.teamB?.length === 1
    ) {
      // すでにteamAに2人、teamBに1人いる場合、残りの1人をteamBに割り当てる
      const remainingPlayers = group.filter(
        (p) =>
          p !== initialSplit.teamA[0] &&
          p !== initialSplit.teamA[1] &&
          p !== initialSplit.teamB[0],
      );
      return [
        {
          teamA: [...initialSplit.teamA],
          teamB: [...initialSplit.teamB, ...remainingPlayers],
        },
      ];
    }

    // ペアがいない場合、すべての組み合わせを生成
    const comb = getCombinations(group, 2);
    const teamPairs: { teamA: number[]; teamB: number[] }[] = [];

    // 各ペアに対して、残りの2人をもう一方のチームに割り当てる
    for (const teamA of comb) {
      const teamB = group.filter((p) => !teamA.includes(p));
      teamPairs.push({ teamA, teamB });
    }

    return teamPairs;
  }
};

// なるべく異なる人と試合すると高得点
export const scoreMatch = (
  match: {
    teamA: number[];
    teamB: number[];
  },
  matches: MatchType[],
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
  genderSetting: GenderPreferenceSetting,
): number => {
  if (!genderSetting.men && !genderSetting.woman && !genderSetting.mix)
    return 0;
  const teamAGenders = team.teamA.map(
    (id) => players.find((p) => p.id === id)?.gender ?? Gender.未設定,
  );
  const teamBGenders = team.teamB.map(
    (id) => players.find((p) => p.id === id)?.gender ?? Gender.未設定,
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
