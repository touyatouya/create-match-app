import Colors from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { AntDesign, Foundation, Ionicons } from "@expo/vector-icons";
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
import MatchPlayer from "./matchPlayer";
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

  const [dispRound, setDispRound] = React.useState<number>(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="リセット"
          onPress={() => {
            setGameRounds([]);
            setPlayers((prev) =>
              prev.map((player) => ({
                ...player,
                matchCount: 0,
              }))
            );
            setSwapPlayer(null);
            setDispRound(0);
          }}
        />
      ),
    });
  }, [
    navigation,
    gameRounds,
    setGameRounds,
    players,
    setPlayers,
    swapPlayer,
    setSwapPlayer,
    dispRound,
    setDispRound,
  ]);

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

  const renderMatch = ({ item, index }: { item: MatchType; index: number }) => (
    <View style={styles.matchCard}>
      <Text style={styles.courtName}>{index + 1}コート</Text>

      <View style={styles.teams}>
        {/* チーム1 */}
        <View style={styles.team}>
          {item.teamA.map((playerId) => {
            const partnerId = item.teamA.find((id) => id !== playerId);
            return (
              <MatchPlayer
                key={playerId}
                swapPlayer={swapPlayer}
                playerId={playerId}
                selectSwapPlayer={selectSwapPlayer}
                partnerId={partnerId}
                isEdit={dispRound === gameRounds.length}
              />
            );
          })}
        </View>

        <Text style={styles.vsText}>VS</Text>

        {/* チーム2 */}
        <View style={styles.team}>
          {item.teamB.map((playerId) => {
            const partnerId = item.teamB.find((id) => id !== playerId);
            return (
              <MatchPlayer
                key={playerId}
                swapPlayer={swapPlayer}
                playerId={playerId}
                selectSwapPlayer={selectSwapPlayer}
                partnerId={partnerId}
                isEdit={dispRound === gameRounds.length}
              />
            );
          })}
        </View>
      </View>
    </View>
  );

  const matches: MatchType[] = gameRounds.flatMap(
    (gameRound) => gameRound.matches
  );

  const playablePlayers = players.filter((player) => {
    return gameRounds[dispRound - 1]?.matches.some((match) => {
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
  //restingSwapPlayerName
  const restPlayerInfo = ({ item }: { item: Player }) => {
    return (
      <>
        <Text
          style={
            swapPlayer === item.id
              ? styles.restingSwapPlayerName
              : styles.restingPlayerName
          }
        >
          {item.name}
        </Text>
        <Text style={styles.playerGender}>
          {item.gender === Gender.男性 ? (
            <Foundation name="male" size={24} color={Colors.men} />
          ) : item.gender === Gender.女性 ? (
            <Foundation name="female" size={24} color={Colors.women} />
          ) : (
            ""
          )}
        </Text>
      </>
    );
  };

  const renderRestingPlayer = ({ item }: { item: Player }) => (
    <>
      {dispRound === gameRounds.length ? (
        <TouchableOpacity
          style={
            swapPlayer === item.id
              ? styles.restingSwapPlayerItem
              : styles.restingPlayerItem
          }
          onPress={() => {
            (swapPlayer == null ||
              swapPlayer === item.id ||
              !restPlayers.some(
                (restPlayer) => restPlayer.id === swapPlayer
              )) &&
              selectSwapPlayer(item.id);
          }}
        >
          {restPlayerInfo({ item })}
        </TouchableOpacity>
      ) : (
        <View style={styles.restingPlayerItem}>{restPlayerInfo({ item })}</View>
      )}
    </>
  );

  const sections: Section[] = [
    {
      title: "",
      data: gameRounds[dispRound - 1]?.matches,
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
            genderSetting,
            setDispRound
          )
        }
      >
        <Ionicons name="refresh" size={20} color={Colors.whiteText} />
        <Text style={styles.generateButtonText}>新しい組み合わせを生成</Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {gameRounds[dispRound - 2] != null ? (
          <TouchableOpacity onPress={() => setDispRound((prev) => prev - 1)}>
            <AntDesign name="left" size={20} color={Colors.normalIcon} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }}></View>
        )}
        {dispRound > 0 && (
          <Text
            style={{
              fontSize: 20,
              marginHorizontal: 8,
            }}
          >
            {dispRound}巡目
          </Text>
        )}
        {gameRounds[dispRound] != null ? (
          <TouchableOpacity onPress={() => setDispRound((prev) => prev + 1)}>
            <AntDesign name="right" size={20} color={Colors.normalIcon} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }}></View>
        )}
      </View>
      {gameRounds[dispRound - 1] != null && (
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
                    <Ionicons name="cafe" size={24} color={Colors.secondary} />
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
  selectButtonText: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: Colors.background,
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
  optionText: {
    fontSize: 16,
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderline,
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
    color: Colors.sectionTitie,
  },
  generateButton: {
    // backgroundColor: Colors.accent,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 44,
  },
  generateButtonText: {
    color: Colors.whiteText,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  matchCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courtName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: Colors.sectionTitie,
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
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  playerName: {
    fontSize: 24,
    color: Colors.blackText,
    fontWeight: "500",
  },
  playerGender: {
    marginRight: 8,
  },
  vsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.remove,
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
    color: Colors.sectionTitie,
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  restingPlayerItem: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: Colors.filterItemBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.borderline,
    flex: 1,
  },
  restingSwapPlayerItem: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: Colors.thirdry,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.secondary,
    flex: 1,
  },
  restingPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: Colors.filterItemName,
    marginRight: 5,
  },
  restingSwapPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: Colors.blackText,
    marginRight: 5,
  },
});

export default Match;
