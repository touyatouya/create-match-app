import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { chunkArray } from "@/utils/chunkArray";
import { generateUniqId } from "@/utils/createId";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import {
  getOpenAppCount,
  markReviewRequersted,
  shouldShowReviewRequest,
} from "@/utils/storeReview";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import { router } from "expo-router";
import * as StoreReview from "expo-store-review";
import React, { useContext, useEffect } from "react";
import {
  LayoutAnimation,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GameRound,
  GenderPreferenceSetting,
  GenerateMode,
  Match as MatchType,
  Player,
} from "../../../types";
import Checkbox from "../CheckBox";
import GenderIcon from "../GenderIcon";
import PrimaryButton from "../PrimaryButton";
import RenderMatch from "./renderMatch";
import { countMatch, createMatch } from "./util";

type SectionDataItem = MatchType | MatchType[] | Player | Player[]; // Player[] は休憩中プレイヤー行用

type Section = {
  title: string;
  type: "match" | "rest" | "matchHistory";
  data: SectionDataItem[];
};

interface MatchProps {
  swapPlayer: number | null;
  setSwapPlayer: React.Dispatch<React.SetStateAction<number | null>>;
  genderSetting: GenderPreferenceSetting;
  dispRound: number;
  setDispRound: React.Dispatch<React.SetStateAction<number>>;
  setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Match: React.FC<MatchProps> = ({
  swapPlayer,
  setSwapPlayer,
  genderSetting,
  dispRound,
  setDispRound,
  setSnackbarVisible,
}) => {
  const {
    players,
    setPlayers,
    gameRounds,
    setGameRounds,
    generateMode,
    pairs,
    courts,
    setIsLoading,
    setNewGames,
    isAdjustMatchCount,
    isPreferMatchCountOverPair,
  } = useContext(AppContext);

  const selectSwapPlayer = (id: number, partnerId?: number | null) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSwapPlayer((prev) => {
      let newSwapPlayer: number | null = null;
      const isRestPlayerPrev = restPlayers.some(
        (restPlayer) => restPlayer.id === prev,
      );
      const isRestPlayerId = restPlayers.some(
        (restPlayer) => restPlayer.id === id,
      );
      if (prev === id) {
        newSwapPlayer = null;
      } else if (prev != null) {
        if (partnerId != null && prev === partnerId) {
          return id;
        } else if (isRestPlayerId && isRestPlayerPrev) {
          return id;
        } else if (isRestPlayerPrev) {
          changePlayableRestPlayer(id, prev);
        } else if (isRestPlayerId) {
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

  const matches: MatchType[] = gameRounds.flatMap(
    (gameRound) => gameRound.matches,
  );

  const playablePlayers = players.filter((player) => {
    if (generateMode === GenerateMode.REPLACE_ALL) {
      return gameRounds[dispRound - 1]?.matches.some((match) => {
        return (
          match.teamA.some((playerId) => playerId === player.id) ||
          match.teamB.some((playerId) => playerId === player.id)
        );
      });
    } else {
      return gameRounds
        .flatMap((gameRound) => gameRound.matches)
        .filter((match) => !match.isFinished || !match.canInsertNext)
        .some((match) => {
          return (
            match.teamA.some((playerId) => playerId === player.id) ||
            match.teamB.some((playerId) => playerId === player.id)
          );
        });
    }
  });

  const playablePlayerIds = new Set(playablePlayers.map((p) => p.id));

  const restPlayers = players.filter(
    (player) => player.isJoin && !playablePlayerIds.has(player.id),
  );

  const restRows = chunkArray(restPlayers, 2);

  const findPlayerInGameRound = (playerId: number, gameRounds: GameRound[]) => {
    for (let grIdx = 0; grIdx < gameRounds.length; grIdx++) {
      for (
        let matchIdx = 0;
        matchIdx < gameRounds[grIdx].matches.length;
        matchIdx++
      ) {
        const match = gameRounds[grIdx].matches[matchIdx];
        if (match.teamA.includes(playerId)) {
          return {
            gameRoundIdx: grIdx,
            matchIdx: matchIdx,
            team: "teamA" as const,
            teamIdx: match.teamA.indexOf(playerId) as number,
          };
        } else if (match.teamB.includes(playerId)) {
          return {
            gameRoundIdx: grIdx,
            team: "teamB" as const,
            matchIdx: matchIdx,
            teamIdx: match.teamB.indexOf(playerId) as number,
          };
        }
      }
    }
    return null;
  };

  const changePlayer = (targetPlayerId: number, selectedPlayerId: number) => {
    setGameRounds((prevGameRounds) => {
      const targetIdx = findPlayerInGameRound(targetPlayerId, prevGameRounds);
      const selectedIdx = findPlayerInGameRound(
        selectedPlayerId,
        prevGameRounds,
      );

      if (!targetIdx || !selectedIdx) {
        return prevGameRounds;
      }

      return prevGameRounds.map((gr, csIdx) => {
        return {
          ...gr,
          matches: gr.matches.map((m) => {
            let updatedMatch = { ...m };

            // プレイヤーAの位置をプレイヤーBに置換
            if (
              csIdx === targetIdx.gameRoundIdx &&
              m.id ===
                prevGameRounds[targetIdx.gameRoundIdx].matches[
                  targetIdx.matchIdx
                ].id
            ) {
              const newTeam = [...m[targetIdx.team]];
              newTeam[targetIdx.teamIdx] = selectedPlayerId;
              updatedMatch[targetIdx.team] = newTeam;
            }

            // プレイヤーBの位置をプレイヤーAに置換
            if (
              csIdx === selectedIdx.gameRoundIdx &&
              m.id ===
                prevGameRounds[selectedIdx.gameRoundIdx].matches[
                  selectedIdx.matchIdx
                ].id
            ) {
              const newTeam = [...m[selectedIdx.team]];
              newTeam[selectedIdx.teamIdx] = targetPlayerId;
              updatedMatch[selectedIdx.team] = newTeam;
            }

            return updatedMatch;
          }),
        };
      });
    });
  };

  const changePlayableRestPlayer = (
    playablePlayerId: number,
    restPlayerId: number,
  ) => {
    let newGameRounds: GameRound[] = [];
    setGameRounds((prevGameRounds) => {
      const playablePlayerIdx = findPlayerInGameRound(
        playablePlayerId,
        prevGameRounds,
      );

      if (!playablePlayerIdx) {
        return prevGameRounds;
      }

      newGameRounds = prevGameRounds.map((gameRound, gameRound_i) => {
        if (gameRound_i === playablePlayerIdx.gameRoundIdx) {
          return {
            ...gameRound,
            matches: gameRound.matches.map((match) => {
              let updatedMatch = { ...match };

              // プレイ中プレイヤーの位置を休憩プレイヤーに置換
              if (
                match.id ===
                prevGameRounds[gameRound_i].matches[playablePlayerIdx.matchIdx]
                  .id
              ) {
                const newTeam = [...match[playablePlayerIdx.team]];
                newTeam[playablePlayerIdx.teamIdx] = restPlayerId;
                updatedMatch[playablePlayerIdx.team] = newTeam;
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
      (gameRound) => gameRound.matches,
    );
    countMatch([...matches], players, setPlayers);
  };

  const renderRestCell = (player: Player) => {
    const content = (
      <>
        <View style={styles.restingPlayerName}>
          <View style={{ flex: 4 }}>
            <Text
              style={[
                styles.restingPlayerText,
                swapPlayer === player.id && styles.restingSwapPlayerName,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {player.name}
            </Text>
          </View>
          {players.find((p) => p.id === player.id)?.isRest && (
            <View style={{ flex: 1 }}>
              <Feather name="coffee" size={14} color={ColorPalette.blackText} />
            </View>
          )}
        </View>
        <View style={styles.subInfo}>
          <Text style={styles.getGameCount}>{player.matchCount}</Text>
          <Text style={styles.playerGender}>
            <GenderIcon gender={player.gender} size={18} />
          </Text>
          {dispRound === gameRounds.length && (
            <Ionicons
              name="swap-horizontal"
              size={14}
              color={ColorPalette.secondary}
            />
          )}
        </View>
      </>
    );

    if (dispRound === gameRounds.length) {
      return (
        <TouchableOpacity
          key={player.id}
          style={[
            styles.restingPlayerItem,
            swapPlayer === player.id && styles.restingSwapPlayerItem,
          ]}
          onPress={() => selectSwapPlayer(player.id)}
        >
          {content}
        </TouchableOpacity>
      );
    } else {
      return (
        <View key={player.id} style={styles.restingPlayerItem}>
          {content}
        </View>
      );
    }
  };

  const renderRestingRow = ({ item }: { item: Player[] }) => (
    <View style={styles.restingRow}>
      {item.map((player, idx) => (
        <View
          key={player.id}
          style={[
            styles.restingCell,
            idx === 0 ? { marginRight: 6 } : { marginLeft: 6 },
          ]}
        >
          {renderRestCell(player)}
        </View>
      ))}
      {item.length === 1 && (
        <View style={[styles.restingCell, { marginLeft: 6 }]} />
      )}
    </View>
  );

  const matchListWithPlaceholders: MatchType[] = (() => {
    if (generateMode === GenerateMode.REPLACE_ALL) return [];
    const active = matches.filter((m) => !m.isFinished);
    const sortedCourts = courts.slice().sort((a, b) => a.number - b.number);
    return sortedCourts.map((court) => {
      const m = active.find((am) => am.courtId === court.id);
      if (m == null) {
        return {
          id: generateUniqId(matches.map((m) => m.id)),
          courtId: court.id,
          teamA: [],
          teamB: [],
          isFinished: false,
          canInsertNext: true,
          finishRound: null,
        };
      }
      return m;
    });
  })();

  const sections: Section[] = [
    {
      title: "",
      data:
        generateMode === GenerateMode.REPLACE_ALL
          ? gameRounds[dispRound - 1]?.matches
          : matchListWithPlaceholders,
      type: "match",
    },
    {
      title: "休憩中のプレイヤー",
      data: restRows,
      type: "rest",
    },
  ];

  const playingCourtIds = gameRounds
    .flatMap((gameRound) => gameRound.matches)
    .filter((match) => !match.canInsertNext)
    .flatMap((match) => match.courtId);

  const avaibleCourts =
    generateMode === GenerateMode.FILL_ENPTY
      ? courts.filter(
          (court) =>
            playingCourtIds == null ||
            playingCourtIds.length === 0 ||
            !playingCourtIds.includes(court.id),
        )
      : courts;

  const isAllMatchCanInsertNext = gameRounds.every((gameRound) =>
    gameRound.matches.every((match) => match.canInsertNext),
  );

  const setAllMatchCanInsertNext = (isAllMatchCanInsertNext: boolean) => {
    setGameRounds((prev) => {
      return prev.map((gameRound) => {
        const newMatches = gameRound.matches.map((match) => {
          if (!match.isFinished) {
            return {
              ...match,
              canInsertNext: !isAllMatchCanInsertNext,
            };
          }
          return match;
        });
        return { ...gameRound, matches: newMatches };
      });
    });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [gameRounds, setIsLoading]);

  return (
    <View style={{ flex: 1 }}>
      {generateMode === GenerateMode.REPLACE_ALL && (
        <PrimaryButton
          text="新しい組み合わせを生成"
          disabled={avaibleCourts.length === 0}
          icon={
            <Ionicons name="refresh" size={24} color={ColorPalette.whiteText} />
          }
          onPress={async () => {
            setIsLoading(true);
            await setTimeout(() => {
              createMatch(
                players,
                setPlayers,
                courts,
                gameRounds,
                setGameRounds,
                pairs,
                matches,
                dispRound,
                generateMode,
                setSwapPlayer,
                genderSetting,
                isAdjustMatchCount,
                isPreferMatchCountOverPair,
                setDispRound,
                setIsLoading,
                setNewGames,
              );
            }, 0);

            const openAppCount = await getOpenAppCount();
            const canShow = await shouldShowReviewRequest();
            if (
              matches.length >= 12 &&
              openAppCount >= 5 &&
              canShow &&
              (await StoreReview.hasAction())
            ) {
              StoreReview.requestReview();
              markReviewRequersted();
            }
          }}
          style={{ marginVertical: 2 }}
        />
      )}
      {/* {generateMode === GenerateMode.FILL_ENPTY && (
        <Text style={{ alignSelf: "center" }}>
          チェックしたコートに試合を入れます
        </Text>
      )} */}
      {generateMode === GenerateMode.FILL_ENPTY && matches.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Checkbox
            onChange={() => {
              setAllMatchCanInsertNext(isAllMatchCanInsertNext);
              setSwapPlayer(null);
            }}
            label="全コート終了"
            checked={isAllMatchCanInsertNext}
          />
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/PlayerScreen/HistoryScreen" })
            }
          >
            <AntDesign name="history" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      {generateMode === GenerateMode.REPLACE_ALL && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {gameRounds[dispRound - 2] != null ? (
            <TouchableOpacity
              style={{
                ...globalStyles.touch,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={async () => {
                setDispRound((prev) => prev - 1);

                await analytics().logEvent("prev_gameRound");
              }}
            >
              <AntDesign
                name="left"
                size={20}
                color={ColorPalette.normalIcon}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ ...globalStyles.touch }}></View>
          )}
          {dispRound > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {gameRounds[dispRound] == null && (
                <View style={{ ...globalStyles.touch }}></View>
              )}
              <Text
                style={{
                  fontSize: FONT_SIZE.subheading,
                  marginHorizontal: 8,
                }}
              >
                {dispRound}巡目
              </Text>
              {gameRounds[dispRound] == null && (
                <TouchableOpacity
                  style={{
                    ...globalStyles.touch,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={async () => {
                    let newGameRounds: GameRound[] = [];
                    setGameRounds((prev) => {
                      newGameRounds = prev.slice(0, -1);
                      if (newGameRounds.length > 0) {
                        newGameRounds[newGameRounds.length - 1] = {
                          ...newGameRounds[newGameRounds.length - 1],
                          matches: newGameRounds[
                            newGameRounds.length - 1
                          ].matches.map((m) => ({
                            ...m,
                            isFinished: false,
                            canInsertNext: false,
                          })),
                        };
                      }
                      return newGameRounds;
                    });
                    const newMatch = newGameRounds.flatMap(
                      (gameRound) => gameRound.matches,
                    );
                    const newPlayers = countMatch(
                      newMatch,
                      players,
                      setPlayers,
                    );
                    setSwapPlayer(null);
                    setDispRound((prev) => prev - 1);

                    await clearGameData();
                    await saveGameData({
                      gameRounds: newGameRounds,
                      courts,
                      generateMode: generateMode,
                      recentPlayers: newPlayers,
                      anonymousPlayerCount: newPlayers.filter(
                        (p) => p.isAnonymous,
                      ).length,
                      pairs,
                      genderSetting,
                      isPreferMatchCountOverPair,
                      saveAt: new Date().getTime(),
                    });

                    await analytics().logEvent("delete_game");
                  }}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          {gameRounds[dispRound] != null ? (
            <TouchableOpacity
              style={{
                ...globalStyles.touch,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={async () => {
                setDispRound((prev) => prev + 1);

                await analytics().logEvent("next_gameRound");
              }}
            >
              <AntDesign
                name="right"
                size={20}
                color={ColorPalette.normalIcon}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ ...globalStyles.touch }}></View>
          )}
        </View>
      )}
      {(gameRounds[dispRound - 1] != null ||
        generateMode === GenerateMode.FILL_ENPTY) && (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) =>
            Array.isArray(item)
              ? `restRow-${index}`
              : (("id" in item) as unknown as Player | MatchType)
                ? `${item.id}-${index}`
                : `${index}`
          }
          renderItem={({ item, section }) => {
            if (section.type === "match") {
              const match = item as MatchType;
              const court = courts.find((court) => court.id === match.courtId);
              const courtId = court?.id as number;
              const courtNumber = court?.number as number;
              const courtMatch = gameRounds
                .flatMap((gameRound) => gameRound.matches)
                .filter((match) => match.courtId === courtId);

              return (
                <RenderMatch
                  item={match}
                  courtMatch={courtMatch}
                  courtId={courtId}
                  courtNumber={courtNumber}
                  swapPlayer={swapPlayer}
                  setSwapPlayer={setSwapPlayer}
                  selectSwapPlayer={selectSwapPlayer}
                  showMatchCount={true}
                  canCheck={generateMode === GenerateMode.FILL_ENPTY}
                  canDelete={true}
                  canSwap={true}
                  dispRound={dispRound}
                />
              ); // 例: カード表示など
            } else if (section.type === "rest") {
              const restRow = item as Player[];
              return renderRestingRow({ item: restRow });
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
                    <Feather
                      name="coffee"
                      size={20}
                      color={ColorPalette.blackText}
                    />
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
      {generateMode === GenerateMode.FILL_ENPTY && (
        <PrimaryButton
          text="新しい組み合わせを生成"
          disabled={avaibleCourts.length === 0}
          icon={
            <Ionicons name="refresh" size={24} color={ColorPalette.whiteText} />
          }
          onPress={async () => {
            setIsLoading(true);
            await setTimeout(() => {
              createMatch(
                players,
                setPlayers,
                courts,
                gameRounds,
                setGameRounds,
                pairs,
                matches,
                dispRound,
                generateMode,
                setSwapPlayer,
                genderSetting,
                isAdjustMatchCount,
                isPreferMatchCountOverPair,
                setDispRound,
                setIsLoading,
                setNewGames,
              );
            }, 0);

            const openAppCount = await getOpenAppCount();
            const canShow = await shouldShowReviewRequest();
            if (
              matches.length >= 12 &&
              openAppCount >= 5 &&
              canShow &&
              (await StoreReview.hasAction())
            ) {
              StoreReview.requestReview();
              markReviewRequersted();
            }
          }}
          style={{ marginVertical: 2 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ColorPalette.borderline,
    paddingVertical: 16,
  },
  subInfo: {
    flex: 1.7,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  getGameCount: {
    flex: 1,
    fontSize: FONT_SIZE.tiny,
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
  playerGender: {
    flex: 1,
  },
  vsText: {
    fontSize: FONT_SIZE.tiny,
    fontWeight: "bold",
    color: ColorPalette.filterItemName,
    marginHorizontal: 6,
  },
  restingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    backgroundColor: ColorPalette.pageBackground,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: "bold",
    color: ColorPalette.sectionTitie,
    marginLeft: 6,
  },
  restingCount: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "600",
  },
  restingPlayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ColorPalette.restPlayerBackground,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    ...globalStyles.touch,
  },
  restingSwapPlayerItem: {
    backgroundColor: ColorPalette.thirdry,
    borderColor: ColorPalette.secondary,
  },
  restingPlayerName: {
    flex: 3,
    marginLeft: 3,
    marginRight: 3,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  restingPlayerText: {
    fontSize: FONT_SIZE.small,
    color: ColorPalette.filterItemName,
  },
  restingSwapPlayerName: {
    flex: 4,
    color: ColorPalette.blackText,
  },
  restingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  restingCell: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: ColorPalette.borderline,
    marginVertical: 8,
  },
});

export default Match;
