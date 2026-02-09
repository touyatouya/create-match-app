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
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import * as StoreReview from "expo-store-review";
import React, { useContext, useEffect } from "react";
import {
  LayoutAnimation,
  SectionList,
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
import PrimaryButton from "../PrimaryButton";
import MatchHeader from "./matchHeader";
import RenderMatch from "./renderMatch";
import RestHeader from "./restHeader";
import RestRow from "./restRow";
import { countMatch, createMatch } from "./util";

type SectionDataItem = MatchType | MatchType[] | Player | Player[]; // Player[] は休憩中プレイヤー行用

type Section = {
  title: string;
  type: "match" | "rest" | "matchHistory";
  data: SectionDataItem[];
};

interface MatchProps {
  swap: {
    player: number | null;
    matchId: number | null;
    partner: number | null;
    isRestPlayer: boolean;
  };
  setSwap: React.Dispatch<
    React.SetStateAction<{
      player: number | null;
      matchId: number | null;
      partner: number | null;
      isRestPlayer: boolean;
    }>
  >;
  genderSetting: GenderPreferenceSetting;
  dispRound: number;
  setDispRound: React.Dispatch<React.SetStateAction<number>>;
  setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Match: React.FC<MatchProps> = ({
  swap,
  setSwap,
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

  const selectSwapPlayer = (
    matchId: number,
    playerId: number,
    partnerId: number,
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSwap((prev) => {
      if (prev.player === playerId) {
        return {
          player: null,
          matchId: null,
          partner: null,
          isRestPlayer: false,
        };
      }

      if (prev.player == null || prev.partner === playerId) {
        return {
          player: playerId,
          matchId,
          partner: partnerId,
          isRestPlayer: false,
        };
      }

      if (prev.isRestPlayer) {
        changePlayableRestPlayer(matchId, playerId, prev.player);
      } else {
        changePlayer(matchId, playerId, prev.matchId as number, prev.player);
      }

      return {
        player: null,
        matchId: null,
        partner: null,
        isRestPlayer: false,
      };
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

  const findPlayerTeamInMatch = (
    playerId: number,
    gameRounds: GameRound[],
    matchId: number,
  ) => {
    const matches = gameRounds.flatMap((gr) => gr.matches.map((m) => m));
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return null;

    if (targetMatch.teamA.includes(playerId)) {
      return {
        team: "teamA" as const,
        teamIdx: targetMatch.teamA.indexOf(playerId) as number,
      };
    } else if (targetMatch.teamB.includes(playerId)) {
      return {
        team: "teamB" as const,
        teamIdx: targetMatch.teamB.indexOf(playerId) as number,
      };
    }
    return null;
  };

  const changePlayer = (
    targetMatchId: number,
    targetPlayerId: number,
    selectedMatchId: number,
    selectedPlayerId: number,
  ) => {
    setGameRounds((prevGameRounds) => {
      const targetTeam = findPlayerTeamInMatch(
        targetPlayerId,
        prevGameRounds,
        targetMatchId,
      );
      const selectedTeam = findPlayerTeamInMatch(
        selectedPlayerId,
        prevGameRounds,
        selectedMatchId,
      );

      if (!targetTeam || !selectedTeam) return prevGameRounds;

      return prevGameRounds.map((gr) => {
        return {
          ...gr,
          matches: gr.matches.map((m) => {
            let updatedMatch = { ...m };

            // プレイヤーAの位置をプレイヤーBに置換
            if (m.id === targetMatchId) {
              const newTeam = [...m[targetTeam.team]];
              newTeam[targetTeam.teamIdx] = selectedPlayerId;
              updatedMatch[targetTeam.team] = newTeam;
            }

            // プレイヤーBの位置をプレイヤーAに置換
            if (m.id === selectedMatchId) {
              const newTeam = [...m[selectedTeam.team]];
              newTeam[selectedTeam.teamIdx] = targetPlayerId;
              updatedMatch[selectedTeam.team] = newTeam;
            }

            return updatedMatch;
          }),
        };
      });
    });
  };

  const changePlayableRestPlayer = (
    matchId: number,
    playablePlayerId: number,
    restPlayerId: number,
  ) => {
    let newGameRounds: GameRound[] = [];
    setGameRounds((prevGameRounds) => {
      const playablePlayerTeam = findPlayerTeamInMatch(
        playablePlayerId,
        prevGameRounds,
        matchId,
      );
      if (!playablePlayerTeam) {
        return prevGameRounds;
      }

      newGameRounds = prevGameRounds.map((gameRound) => {
        return {
          ...gameRound,
          matches: gameRound.matches.map((match) => {
            let updatedMatch = { ...match };

            // プレイ中プレイヤーの位置を休憩プレイヤーに置換
            if (match.id === matchId) {
              const newTeam = [...match[playablePlayerTeam.team]];
              newTeam[playablePlayerTeam.teamIdx] = restPlayerId;
              updatedMatch[playablePlayerTeam.team] = newTeam;
            }

            return updatedMatch;
          }),
        };
      });

      return newGameRounds;
    });
    const matches: MatchType[] = newGameRounds.flatMap(
      (gameRound) => gameRound.matches,
    );
    countMatch([...matches], players, setPlayers);
  };

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

  const resetSwap = () => {
    setSwap({
      player: null,
      matchId: null,
      partner: null,
      isRestPlayer: false,
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
                resetSwap,
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
      <MatchHeader resetSwap={resetSwap} />
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
                    resetSwap();
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
                  swapPlayer={swap.player}
                  restSwap={resetSwap}
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
              return (
                <RestRow
                  item={restRow}
                  dispRound={dispRound}
                  setSwap={setSwap}
                  swap={swap}
                />
              );
            }
            return null;
          }}
          renderSectionHeader={({ section }) => {
            if (section.type === "match") {
              return null;
            } else if (section.type === "rest") {
              return <RestHeader dispRound={dispRound} />;
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
                resetSwap,
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

export default Match;
