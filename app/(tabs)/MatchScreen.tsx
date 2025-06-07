import { AppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect } from "react";
import {
  Alert,
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GameRound, Match, Player } from "../../types";

type SectionDataItem = Match | Player;

type Section = {
  title: string;
  type: "match" | "rest";
  data: SectionDataItem[];
};

const MatchScreen: React.FC = () => {
  const { players, setPlayers, gameRounds, setGameRounds, pairs, courts } =
    useContext(AppContext);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="リセット"
          onPress={() => {
            setGameRounds([]);
            setPlayers((prev) => {
              return prev.map((player) => {
                return {
                  ...player,
                  matchCount: 0,
                };
              });
            });
          }}
        />
      ),
    });
  }, [navigation, setGameRounds, setPlayers]);

  const handlePlayerSwap = (playerId: number, partnerId: number) => {
    const replaceplayers = players.filter((player) => {
      const isMyself = player.id === playerId;
      const isParner = player.id === partnerId;
      return player.isJoin && !isMyself && !isParner;
    });
    Alert.alert(
      "プレイヤー交代",
      replaceplayers.length > 0
        ? "交代させるプレイヤーを選択"
        : "交代できるプレイヤーがいません",
      [
        ...replaceplayers
          .sort((playerA, playerB) => {
            const isRestA =
              restPlayers.length > 0 &&
              restPlayers.find((restPlayer) => restPlayer.id === playerA.id) !=
                null;

            const isRestB =
              restPlayers.length > 0 &&
              restPlayers.find((restPlayer) => restPlayer.id === playerB.id) !=
                null;

            const result = isRestA === isRestB ? 0 : isRestA ? 1 : -1;

            return result;
          })
          .map((player) => {
            const isRest =
              restPlayers.length > 0 &&
              restPlayers.find((restPlayer) => restPlayer.id === player.id) !=
                null;
            return {
              text: isRest
                ? `休憩中：${player.name}`
                : `試合中：${player.name}`,
              onPress: () =>
                isRest
                  ? changePlayableRestPlayer(playerId, player.id)
                  : changePlayer(playerId, player.id),
            };
          }),
        {
          text: "キャンセル",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const renderMatch = ({ item, index }: { item: Match; index: number }) => (
    <View style={styles.matchCard}>
      <Text style={styles.courtName}>{index + 1}コート</Text>

      <View style={styles.teams}>
        {/* チーム1 */}
        <View style={styles.team}>
          {item.teamA.map((playerId) => (
            <TouchableOpacity
              key={playerId}
              style={styles.playerButton}
              onPress={() => {
                const partnerId = item.teamA.find((id) => id !== playerId);
                // 仕様上partnerIdがnullになることはないため、asを使用
                handlePlayerSwap(playerId, partnerId as number);
              }}
            >
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{getPlayerName(playerId)}</Text>
              </View>
              <Ionicons name="swap-horizontal" size={18} color="#007BFF" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.vsText}>VS</Text>

        {/* チーム2 */}
        <View style={styles.team}>
          {item.teamB.map((playerId) => (
            <TouchableOpacity
              key={playerId}
              style={styles.playerButton}
              onPress={() => {
                const partnerId = item.teamB.find((id) => id !== playerId);
                // 仕様上partnerIdがnullになることはないため、asを使用
                handlePlayerSwap(playerId, partnerId as number);
              }}
            >
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{getPlayerName(playerId)}</Text>
              </View>
              <Ionicons name="swap-horizontal" size={18} color="#007BFF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const matches: Match[] = gameRounds.flatMap((gameRound) => gameRound.matches);

  const playablePlayers = players.filter((player) => {
    return gameRounds[gameRounds.length - 1]?.matches.some((match) => {
      return (
        match.teamA.some((playerId) => playerId === player.id) ||
        match.teamB.some((playerId) => playerId === player.id)
      );
    });
  });

  const playablePlayerIds = new Set(playablePlayers.map((p) => p.id));

  const restPlayers = players.filter(
    (player) => player.isJoin && !playablePlayerIds.has(player.id)
  );

  const createMatch = (): void => {
    const sortedPlayer: Player[] = players
      .filter((player) => player.isJoin && !player.isRest)
      .sort((a, b) => a.matchCount - b.matchCount);

    if (sortedPlayer.length < courts.length * 4)
      return Alert.alert(
        "試合を作成できません",
        "コート数に対する人数が足りません。\nコート数を減らすか、人数を増やしてください。"
      );

    let separatedPlayers: Player[][] = [];
    let matchCountSeparete_i = 0;
    for (let player_i = 0; player_i < sortedPlayer.length; player_i++) {
      if (
        player_i !== 0 &&
        sortedPlayer[player_i - 1].matchCount <
          sortedPlayer[player_i].matchCount
      ) {
        matchCountSeparete_i++;
      }
      if (separatedPlayers[matchCountSeparete_i] == null)
        separatedPlayers[matchCountSeparete_i] = [];
      separatedPlayers[matchCountSeparete_i].push(sortedPlayer[player_i]);
    }

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
      normalPlayers.map((player) => player.id)
    );

    if (gameRound == null) return;

    setGameRounds((prev) => [...prev, gameRound]);

    const preMatches: Match[] = gameRounds.flatMap(
      (gameRound) => gameRound.matches
    );
    countMatch([...preMatches, ...gameRound.matches]);
  };

  // スコアの高いコート構成を選ぶ関数
  function selectBestGameRounds(
    requiredPlayers: number[],
    optionalPlayers: number[]
  ): GameRound {
    const playersId = [...requiredPlayers, ...optionalPlayers];

    // 計算量削減のため100個に制限
    const partitions = getRandomGroupPartitions(playersId, 100);

    // 計算量削減のため100個に制限
    const limitedPartitions = partitions
      .sort(() => Math.random() - 0.5)
      .slice(0, 100);

    let bestSets: GameRound[] = [];
    let bestScore = -Infinity;

    for (const coatSet of limitedPartitions) {
      const allTeamSplitSets = coatSet.map((group) =>
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

      // 計算量削減のため50個に制限
      const allCourtTeamCombinations = combineLimited(allTeamSplitSets, 50);

      for (const courtTeams of allCourtTeamCombinations) {
        const gameRound: GameRound = {
          id:
            gameRounds.length > 0
              ? gameRounds[gameRounds.length - 1].id + 1
              : 0,
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

        // すべてのペアが同じチームに存在するかをチェック
        const areAllPairsValid = pairs.every((pair) => {
          return courtTeams.every((team) => {
            const aHas1 = team.teamA.includes(pair.player1);
            const aHas2 = team.teamA.includes(pair.player2);
            const bHas1 = team.teamB.includes(pair.player1);
            const bHas2 = team.teamB.includes(pair.player2);

            const sameInA = aHas1 && aHas2;
            const sameInB = bHas1 && bHas2;
            const bothAbsent = !aHas1 && !bHas1 && !aHas2 && !bHas2;

            const eitherOnly = (aHas1 || bHas1) !== (aHas2 || bHas2); // どちらか一方だけ出場

            return sameInA || sameInB || bothAbsent || eitherOnly;
          });
        });

        if (!areAllPairsValid) continue;

        const totalScore = courtTeams.reduce((acc, team) => {
          return (
            acc +
            (team.teamA.length + team.teamB.length < 2 ? 0 : scoreMatch(team))
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

  const countMatch = (newMatches: Match[]): void => {
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

  const countPairedBefore = (player1: number, player2: number) => {
    const joinedTeamAMatches = matches.filter((match) =>
      match.teamA.includes(player1)
    );
    const joinedTeamBMatches = matches.filter((match) =>
      match.teamB.includes(player1)
    );

    return (
      joinedTeamAMatches.filter((match) => match.teamA.includes(player2))
        .length +
      joinedTeamBMatches.filter((match) => match.teamB.includes(player2)).length
    );
  };

  const countFacedBefore = (player1: number, player2: number) => {
    const joinedTeamAMatches = matches.filter((match) =>
      match.teamA.includes(player1)
    );
    const joinedTeamBMatches = matches.filter((match) =>
      match.teamB.includes(player1)
    );

    return (
      joinedTeamAMatches.filter((match) => match.teamB.includes(player2))
        .length +
      joinedTeamBMatches.filter((match) => match.teamA.includes(player2)).length
    );
  };

  // 12人を3グループに分割（各グループ4人）
  const getRandomGroupPartitions = (
    players: number[],
    trials = 100
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
  const getTeamSplits = (
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

  // スコア計算
  const scoreMatch = (match: { teamA: number[]; teamB: number[] }): number => {
    let score = 0;

    // 味方との過去の組み合わせが多いほど減点
    for (const p1 of match.teamA) {
      for (const p2 of match.teamA) {
        if (p1 !== p2) {
          const count = countPairedBefore(p1, p2);
          score += count * -1;
        }
      }
    }
    // 相手との過去の対戦が多いほどさらに減点（優先度高）
    for (const p1 of match.teamA) {
      for (const p2 of match.teamB) {
        const count = countFacedBefore(p1, p2);
        score += count * -1;
      }
    }

    return score;
  };

  // n個の中からk個を選ぶすべての組み合わせ
  function getCombinations<T>(arr: T[], k: number): T[][] {
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

  const changePlayer = (targetPlayerId: number, selectedPlayerId: number) => {
    setGameRounds((prevGameRounds) => {
      let sourceSetIndex = -1,
        sourceMatchIndex = -1,
        sourceTeam: "teamA" | "teamB" = "teamA",
        sourceIndex = -1;

      let targetSetIndex = -1,
        targetMatchIndex = -1,
        targetTeam: "teamA" | "teamB" = "teamA",
        targetIndex = -1;

      // プレイヤーBの位置を探す
      for (let csIdx = 0; csIdx < prevGameRounds.length; csIdx++) {
        const courts = prevGameRounds[csIdx].matches;
        for (let mIdx = 0; mIdx < courts.length; mIdx++) {
          const match = courts[mIdx];
          const teamAIdx = match.teamA.indexOf(selectedPlayerId);
          if (teamAIdx !== -1) {
            sourceSetIndex = csIdx;
            sourceMatchIndex = mIdx;
            sourceTeam = "teamA";
            sourceIndex = teamAIdx;
          }
          const teamBIdx = match.teamB.indexOf(selectedPlayerId);
          if (teamBIdx !== -1) {
            sourceSetIndex = csIdx;
            sourceMatchIndex = mIdx;
            sourceTeam = "teamB";
            sourceIndex = teamBIdx;
          }

          const teamAIdxA = match.teamA.indexOf(targetPlayerId);
          if (teamAIdxA !== -1) {
            targetSetIndex = csIdx;
            targetMatchIndex = mIdx;
            targetTeam = "teamA";
            targetIndex = teamAIdxA;
          }
          const teamBIdxA = match.teamB.indexOf(targetPlayerId);
          if (teamBIdxA !== -1) {
            targetSetIndex = csIdx;
            targetMatchIndex = mIdx;
            targetTeam = "teamB";
            targetIndex = teamBIdxA;
          }
        }
      }

      if (
        sourceSetIndex === -1 ||
        sourceMatchIndex === -1 ||
        sourceIndex === -1 ||
        targetSetIndex === -1 ||
        targetMatchIndex === -1 ||
        targetIndex === -1
      ) {
        console.warn("どちらかのプレイヤーの位置が見つかりません");
        return prevGameRounds;
      }

      return prevGameRounds.map((gr, csIdx) => {
        return {
          ...gr,
          courts: gr.matches.map((m) => {
            let updatedMatch = { ...m };

            // プレイヤーAの位置をプレイヤーBに置換
            if (
              csIdx === targetSetIndex &&
              m.id ===
                prevGameRounds[targetSetIndex].matches[targetMatchIndex].id
            ) {
              const newTeam = [...m[targetTeam]];
              newTeam[targetIndex] = selectedPlayerId;
              updatedMatch[targetTeam] = newTeam;
            }

            // プレイヤーBの位置をプレイヤーAに置換
            if (
              csIdx === sourceSetIndex &&
              m.id ===
                prevGameRounds[sourceSetIndex].matches[sourceMatchIndex].id
            ) {
              const newTeam = [...m[sourceTeam]];
              newTeam[sourceIndex] = targetPlayerId;
              updatedMatch[sourceTeam] = newTeam;
            }

            return updatedMatch;
          }),
        };
      });
    });
  };

  const changePlayableRestPlayer = (
    playablePlayerId: number,
    restPlayerId: number
  ) => {
    setGameRounds((prevGameRounds) => {
      let playablePlayerMatchIndex = -1,
        playablePlayerTeam: "teamA" | "teamB" = "teamA",
        playablePlayerIndex = -1;

      // プレイ中プレイヤーの位置を探す
      const courts = prevGameRounds[prevGameRounds.length - 1].matches;
      for (let match_i = 0; match_i < courts.length; match_i++) {
        const match = courts[match_i];

        const teamAIdx = match.teamA.indexOf(playablePlayerId);
        if (teamAIdx !== -1) {
          playablePlayerMatchIndex = match_i;
          playablePlayerTeam = "teamA";
          playablePlayerIndex = teamAIdx;
        }
        const teamBIdx = match.teamB.indexOf(playablePlayerId);
        if (teamBIdx !== -1) {
          playablePlayerMatchIndex = match_i;
          playablePlayerTeam = "teamB";
          playablePlayerIndex = teamBIdx;
        }
      }

      if (playablePlayerMatchIndex === -1 || playablePlayerIndex === -1) {
        console.warn("どちらかのプレイヤーの位置が見つかりません");
        console.warn(
          "playablePlayerMatchIndex === -1",
          playablePlayerMatchIndex === -1
        );
        console.warn("playablePlayerIndex === -1", playablePlayerIndex === -1);
        return prevGameRounds;
      }

      const gameRounds = prevGameRounds.map((gameRound, gameRound_i) => {
        if (gameRound_i === prevGameRounds.length - 1) {
          return {
            ...gameRound,
            courts: gameRound.matches.map((match) => {
              let updatedMatch = { ...match };

              // プレイ中プレイヤーの位置を休憩プレイヤーに置換
              if (
                match.id ===
                prevGameRounds[gameRound_i].matches[playablePlayerMatchIndex].id
              ) {
                const newTeam = [...match[playablePlayerTeam]];
                newTeam[playablePlayerIndex] = restPlayerId;
                updatedMatch[playablePlayerTeam] = newTeam;
              }

              return updatedMatch;
            }),
          };
        } else {
          return { ...gameRound };
        }
      });

      return gameRounds;
    });
    const matches: Match[] = gameRounds.flatMap(
      (gameRound) => gameRound.matches
    );
    countMatch([...matches]);
  };

  const getPlayerName = (id: number) => {
    return players.find((player) => player.id === id)?.name;
  };

  const renderRestingPlayer = ({ item }: { item: Player }) => (
    <View style={styles.restingPlayerItem}>
      <Text style={styles.restingPlayerName}>{item.name}</Text>
    </View>
  );

  const sections: Section[] = [
    {
      title: "",
      data: gameRounds[gameRounds.length - 1]?.matches,
      type: "match",
    },
    {
      title: "休憩中のプレイヤー",
      data: restPlayers,
      type: "rest",
    },
  ];

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={styles.header}>
        <Text style={styles.title}>試合管理</Text>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={createMatch}>
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.generateButtonText}>新しい組み合わせを生成</Text>
      </TouchableOpacity>

      {gameRounds[gameRounds.length - 1] != null && (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={({ item, index, section }) => {
            if (section.type === "match") {
              const match = item as Match;
              return renderMatch({ item: match, index: index }); // 例: カード表示など
            } else if (section.type === "rest") {
              const restPlayer = item as Player;
              return renderRestingPlayer({ item: restPlayer }); // 例: 名前だけ表示など
            }
            return null;
          }}
          renderSectionHeader={({ section }) => {
            if (section.type === "match") {
              return null;
            } else if (section.type === "rest") {
              return (
                <View style={styles.restingHeader}>
                  <View style={styles.restingTitle}>
                    <Ionicons name="cafe" size={24} color="#edab12" />
                    <Text style={styles.restingSectionTitle}>
                      休憩中のプレイヤー
                    </Text>
                  </View>
                  <Text style={styles.restingCount}>
                    {restPlayers.length}人
                  </Text>
                </View>
              );
            }
            return null;
          }}
          // contentContainerStyle={styles.sectionListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#6200EE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  generateButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  matchCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courtName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  teams: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  team: {
    flex: 1,
    gap: 4,
  },
  playerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    color: "#333",
    fontWeight: "500",
  },
  vsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginHorizontal: 6,
  },
  restingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  restingPlayerItem: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FFE8B2",
    flex: 1,
  },
  restingPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: "#664500",
    marginRight: 5,
  },
});

export default MatchScreen;
