import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import {
  getOpenAppCount,
  markReviewRequersted,
  shouldShowReviewRequest,
} from "@/utils/storeReview";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import analytics from "@react-native-firebase/analytics";
import { generateUniqId } from "@/utils/createId";
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
    // isProUser,
    // numOfGenerate,
    setNumOfGenerate,
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

  // 追加: restPlayers を 2 件ずつの行に分割するヘルパー
  const chunkArray = (arr: Player[], size = 2) => {
    const chunks: Player[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const restRows = chunkArray(restPlayers, 2);

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
    restPlayerId: number,
  ) => {
    let newGameRounds: GameRound[] = [];
    setGameRounds((prevGameRounds) => {
      let playablePlayerMatchIndex = -1,
        playablePlayerTeam: "teamA" | "teamB" = "teamA",
        playablePlayerIndex = -1;

      // 対象の巡目インデックス（dispRound が範囲外のとき安全にクランプ）
      const targetRoundIndex = Math.max(
        0,
        Math.min(prevGameRounds.length - 1, dispRound - 1),
      );

      // プレイ中プレイヤーの位置を探す
      const courts = prevGameRounds[targetRoundIndex].matches;
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
        if (gameRound_i === targetRoundIndex) {
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
      (gameRound) => gameRound.matches,
    );
    const newPlayers = [...players];
    const idxRest = newPlayers.findIndex((p) => p.id === restPlayerId);
    const idxPlayable = newPlayers.findIndex((p) => p.id === playablePlayerId);

    if (idxRest !== -1 && idxPlayable !== -1) {
      const restPlayer = { ...newPlayers[idxRest], isRest: true };
      const playablePlayer = { ...newPlayers[idxPlayable], isRest: false };

      // rest 側の位置を保持するために配列要素を入れ替える
      newPlayers[idxRest] = playablePlayer;
      newPlayers[idxPlayable] = restPlayer;

      setPlayers(newPlayers);
    }
    countMatch([...matches], newPlayers, setPlayers);
  };

  const renderRestCell = (player: Player) => {
    const content = (
      <>
        <Text
          style={[
            styles.restingPlayerName,
            swapPlayer === player.id && styles.restingSwapPlayerName,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {player.name}
        </Text>
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
      {/* {isProUser || numOfGenerate < 5 ? ( */}
      {/* {numOfGenerate < 5 ? (
        <PrimaryButton
          text="新しい組み合わせを生成"
          icon={
            <Ionicons name="refresh" size={24} color={ColorPalette.whiteText} />
          }
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => {
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
            }, 0);
          }}
        />
      ) : (
        <RewardAdButton
          onPress={() => setNumOfGenerate(0)}
          text="動画を見て更に組み合わせを作る"
          setSnackbarVisible={setSnackbarVisible}
        />
      )} */}
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
              setDispRound,
              setIsLoading,
              setNumOfGenerate,
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

                // await analytics().logEvent("prev_gameRound", {
                //   player_count: players.length,
                //   anonymous_player_: players.filter((p) => p.isAnonymous).length,
                //   noAnonymous_player_: players.filter((p) => !p.isAnonymous)
                //     .length,
                //   court_count: courts.length,
                //   game_count: gameRounds.length,
                //   match_count: matches.length,
                // });
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
                    setGameRounds((prev) => prev.slice(0, -1));
                    setPlayers((prev) => {
                      return prev.map((player) => {
                        return {
                          ...player,
                          isRest: false,
                          matchCount: 0,
                        };
                      });
                    });
                    setSwapPlayer(null);
                    setDispRound((prev) => prev - 1);

                    // await analytics().logEvent("delete_game");
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

                // await analytics().logEvent("next_gameRound", {
                //   player_count: players.length,
                //   anonymous_player_: players.filter((p) => p.isAnonymous).length,
                //   noAnonymous_player_: players.filter((p) => !p.isAnonymous)
                //     .length,
                //   court_count: courts.length,
                //   game_count: gameRounds.length,
                //   match_count: matches.length,
                // });
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
                    <Ionicons
                      name="cafe-outline"
                      size={24}
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
    marginRight: 2,
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
    marginRight: 2,
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
    paddingHorizontal: 12,
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
    flex: 4,
    marginLeft: 6,
    fontSize: FONT_SIZE.small,
    color: ColorPalette.filterItemName,
    marginRight: 5,
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
