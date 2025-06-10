import { AppContext } from "@/context/AppContext";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect } from "react";
import {
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GameRound,
  Gender,
  GenderPreferenceSetting,
  Match as MatchType,
  Player,
} from "../../../types";
import { countMatch, createMatch } from "./util";

type SectionDataItem = MatchType | Player;

type Section = {
  title: string;
  type: "match" | "rest";
  data: SectionDataItem[];
};

interface MatchProps {
  swapPlayer: number | null;
  setSwapPlayer: React.Dispatch<React.SetStateAction<number | null>>;
  genderSetting: GenderPreferenceSetting;
}

const Match: React.FC<MatchProps> = ({
  swapPlayer,
  setSwapPlayer,
  genderSetting,
}) => {
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
            setSwapPlayer(null);
          }}
        />
      ),
    });
  }, [navigation, setGameRounds, setPlayers, setSwapPlayer]);

  const selectSwapPlayer = (id: number) => {
    setSwapPlayer((prev) => {
      let newSwapPlayer: number | null = null;
      if (prev === id) {
        newSwapPlayer = null;
      } else if (prev != null) {
        if (restPlayers.some((restPlayer) => restPlayer.id === prev)) {
          changePlayableRestPlayer(id, prev);
        } else if (restPlayers.some((restPlayer) => restPlayer.id === id)) {
          changePlayableRestPlayer(prev, id);
        } else {
          changePlayer(prev, id);
        }
        newSwapPlayer = null;
      } else {
        newSwapPlayer = id;
      }

      return newSwapPlayer;
    });
  };

  const getGender = (id: number) => {
    return players.find((player) => player.id === id)?.gender;
  };

  const renderMatch = ({ item, index }: { item: MatchType; index: number }) => (
    <View style={styles.matchCard}>
      <Text style={styles.courtName}>{index + 1}コート</Text>

      <View style={styles.teams}>
        {/* チーム1 */}
        <View style={styles.team}>
          {item.teamA.map((playerId) => (
            <TouchableOpacity
              key={playerId}
              style={
                swapPlayer === playerId
                  ? styles.swapPlayerButton
                  : styles.playerButton
              }
              onPress={() => {
                const partnerId = item.teamA.find((id) => id !== playerId);
                swapPlayer !== partnerId && selectSwapPlayer(playerId);
              }}
            >
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{getPlayerName(playerId)}</Text>
                <Text style={styles.playerGender}>
                  {getGender(playerId) === Gender.男性 ? (
                    <Foundation name="male" size={24} color="blue" />
                  ) : getGender(playerId) === Gender.女性 ? (
                    <Foundation name="female" size={24} color="red" />
                  ) : (
                    ""
                  )}
                </Text>
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
              style={
                swapPlayer === playerId
                  ? styles.swapPlayerButton
                  : styles.playerButton
              }
              onPress={() => {
                const partnerId = item.teamB.find((id) => id !== playerId);
                swapPlayer !== partnerId && selectSwapPlayer(playerId);
              }}
            >
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{getPlayerName(playerId)}</Text>
                <Text style={styles.playerGender}>
                  {getGender(playerId) === Gender.男性 ? (
                    <Foundation name="male" size={24} color="blue" />
                  ) : getGender(playerId) === Gender.女性 ? (
                    <Foundation name="female" size={24} color="red" />
                  ) : (
                    ""
                  )}
                </Text>
              </View>
              <Ionicons name="swap-horizontal" size={18} color="#007BFF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const matches: MatchType[] = gameRounds.flatMap(
    (gameRound) => gameRound.matches
  );

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
        return prevGameRounds;
      }

      return prevGameRounds.map((gr, csIdx) => {
        return {
          ...gr,
          matches: gr.matches.map((m) => {
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
    let newGameRounds: GameRound[] = [];
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
        return prevGameRounds;
      }

      newGameRounds = prevGameRounds.map((gameRound, gameRound_i) => {
        if (gameRound_i === prevGameRounds.length - 1) {
          return {
            ...gameRound,
            matches: gameRound.matches.map((match) => {
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

      return newGameRounds;
    });
    const matches: MatchType[] = newGameRounds.flatMap(
      (gameRound) => gameRound.matches
    );
    countMatch([...matches], players, setPlayers);
  };

  const getPlayerName = (id: number) => {
    return players.find((player) => player.id === id)?.name;
  };

  const renderRestingPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity
      style={
        swapPlayer === item.id
          ? styles.restingSwapPlayerItem
          : styles.restingPlayerItem
      }
      onPress={() => {
        (swapPlayer == null ||
          swapPlayer === item.id ||
          !restPlayers.some((restPlayer) => restPlayer.id === swapPlayer)) &&
          selectSwapPlayer(item.id);
      }}
    >
      <Text style={styles.restingPlayerName}>{item.name}</Text>
      <Text style={styles.playerGender}>
        {item.gender === Gender.男性 ? (
          <Foundation name="male" size={24} color="blue" />
        ) : item.gender === Gender.女性 ? (
          <Foundation name="female" size={24} color="red" />
        ) : (
          ""
        )}
      </Text>
    </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() =>
          createMatch(
            players,
            setPlayers,
            courts,
            gameRounds,
            setGameRounds,
            pairs,
            matches,
            setSwapPlayer,
            genderSetting
          )
        }
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.generateButtonText}>新しい組み合わせを生成</Text>
      </TouchableOpacity>

      {gameRounds[gameRounds.length - 1] != null && (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={({ item, index, section }) => {
            if (section.type === "match") {
              const match = item as MatchType;
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
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    paddingVertical: 16,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  genderEdit: {
    flexDirection: "row",
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
  swapPlayerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#cc7838",
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  playerName: {
    fontSize: 24,
    color: "#333",
    fontWeight: "500",
  },
  playerGender: {
    marginRight: 8,
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
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // borderColor: "#FFE8B2",
    flex: 1,
  },
  restingSwapPlayerItem: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#cc7838",
    // borderColor: "#FFE8B2",
    flex: 1,
  },
  restingPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: "#664500",
    marginRight: 5,
  },
});

export default Match;
