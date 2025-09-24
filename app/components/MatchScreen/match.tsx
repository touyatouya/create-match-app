import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { requestReview } from "@/utils/requestReview";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
  Match as MatchType,
  Player,
} from "../../../types";
import GenderIcon from "../GenderIcon";
import PrimaryButton from "../PrimaryButton";
import RewardAdButton from "../rewardAdButton";
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
    pairs,
    courts,
    isLoading,
    setIsLoading,
    // isProUser,
    numOfGenerate,
    setNumOfGenerate,
  } = useContext(AppContext);

  const selectSwapPlayer = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
                isSwap={dispRound === gameRounds.length}
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
                isSwap={dispRound === gameRounds.length}
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
          style={[
            styles.restingPlayerName,
            swapPlayer === item.id && styles.restingSwapPlayerName,
          ]}
        >
          {item.name}
        </Text>
        <Text style={styles.playerGender}>
          <GenderIcon gender={item.gender} />
        </Text>
      </>
    );
  };

  const renderRestingPlayer = ({ item }: { item: Player }) => (
    <>
      {dispRound === gameRounds.length ? (
        <TouchableOpacity
          style={[
            styles.restingPlayerItem,
            swapPlayer === item.id && styles.restingSwapPlayerItem,
          ]}
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

  useEffect(() => {
    if (dispRound > 0) {
      setIsLoading(false);
    }
  }, [dispRound, setIsLoading]); // 6回目の組み合わせ生成後にレビュー依頼

  useEffect(() => {
    if (gameRounds.length === 6 && !isLoading) {
      requestReview();
    }
  }, [gameRounds.length, isLoading]);

  return (
    <View style={{ flex: 1 }}>
      {/* {isProUser || numOfGenerate < 5 ? ( */}
      {/* 5の倍数でリワード広告を流すボタンにする */}
      {numOfGenerate === 0 || numOfGenerate % 5 !== 0 ? (
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
          text="動画を見て更に組み合わせを作る"
          setSnackbarVisible={setSnackbarVisible}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        {gameRounds[dispRound - 2] != null ? (
          <TouchableOpacity
            style={{
              ...globalStyles.touch,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setDispRound((prev) => prev - 1)}
          >
            <AntDesign name="left" size={20} color={ColorPalette.normalIcon} />
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
                onPress={() => {
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
                }}
              >
                <AntDesign name="delete" size={24} color="black" />
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
            onPress={() => setDispRound((prev) => prev + 1)}
          >
            <AntDesign name="right" size={20} color={ColorPalette.normalIcon} />
          </TouchableOpacity>
        ) : (
          <View style={{ ...globalStyles.touch }}></View>
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
                    <Ionicons
                      name="cafe"
                      size={24}
                      color={ColorPalette.restIcon}
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
  matchCard: {
    backgroundColor: ColorPalette.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courtName: {
    fontSize: FONT_SIZE.small,
    fontWeight: "bold",
    marginBottom: 4,
    color: ColorPalette.sectionTitie,
  },
  teams: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  team: {
    flex: 1,
    gap: 8,
  },
  playerGender: {
    marginRight: 8,
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
    marginBottom: 12,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: ColorPalette.sectionTitie,
  },
  restingCount: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: "600",
  },
  restingPlayerItem: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: ColorPalette.restPlayerBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    flex: 1,
    ...globalStyles.touch,
  },
  restingSwapPlayerItem: {
    backgroundColor: ColorPalette.thirdry,
    borderColor: ColorPalette.secondary,
  },
  restingPlayerName: {
    marginLeft: 6,
    fontSize: FONT_SIZE.heading,
    color: ColorPalette.filterItemName,
    marginRight: 5,
  },
  restingSwapPlayerName: {
    color: ColorPalette.blackText,
  },
});

export default Match;
