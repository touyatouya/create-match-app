import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { GameRound, GenerateMode, Match as MatchType, Player } from "@/types";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Checkbox from "../CheckBox";
import MatchPlayer from "./matchPlayer";
import { countMatch } from "./util";

interface MatchProps {
  item: MatchType;
  courtMatch: MatchType[];
  courtId: number;
  courtNumber: number;
  swapPlayer: number | null;
  setSwapPlayer: React.Dispatch<React.SetStateAction<number | null>>;
  selectSwapPlayer: (id: number, partnerId?: number | null) => void;
  canCheck: boolean;
  canDelete: boolean;
  canSwap: boolean;
  showMatchCount: boolean;
  dispRound: number;
}

const RenderMatch: React.FC<MatchProps> = ({
  item,
  courtMatch,
  courtId,
  courtNumber,
  swapPlayer,
  setSwapPlayer,
  selectSwapPlayer,
  canCheck,
  canDelete,
  canSwap,
  showMatchCount,
  dispRound,
}) => {
  const {
    courts,
    gameRounds,
    setGameRounds,
    generateMode,
    players,
    setPlayers,
    pairs,
    genderSetting,
    newGames,
    setNewGames,
  } = React.useContext(AppContext);

  const isNoMatch =
    (item.teamA == null || item.teamA.length === 0) &&
    (item.teamB == null || item.teamB.length === 0);

  const anim = React.useRef(new Animated.Value(1)).current;
  // newGames は「アニメーション対象の match.id の配列」とする。
  const isNew = Array.isArray(newGames) && newGames.includes(item.id);

  React.useEffect(() => {
    if (!isNew) return;
    anim.setValue(0.3);
    const fade = Animated.timing(anim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    });
    fade.start(() => {
      setNewGames((prev) => prev.filter((id) => id !== item.id));
    });
    return () => {
      fade.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, item.id]);

  return (
    <Animated.View
      style={[
        styles.matchCard,
        generateMode === GenerateMode.FILL_ENPTY &&
          !isNoMatch && { paddingTop: 0, paddingBottom: 4 },
        generateMode === GenerateMode.FILL_ENPTY &&
          item.canInsertNext && {
            backgroundColor: ColorPalette.finished,
          },
        generateMode === GenerateMode.REPLACE_ALL &&
          item.isFinished && {
            backgroundColor: ColorPalette.finished,
            opacity: 0.6,
          },
        isNew && { opacity: anim },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {generateMode === GenerateMode.FILL_ENPTY &&
          !isNoMatch &&
          canCheck ? (
            <Checkbox
              onChange={() => {
                setGameRounds((prev) => {
                  return prev.map((gameRound, i) => {
                    const newMatches = gameRound.matches.map((match) => {
                      if (!match.isFinished && match.courtId === courtId) {
                        return {
                          ...match,
                          canInsertNext: !match.canInsertNext,
                          finishRound: dispRound,
                        };
                      }
                      return {
                        ...match,
                      };
                    });

                    return {
                      ...gameRound,
                      matches: newMatches,
                    };
                  });
                });
                setSwapPlayer(null);
              }}
              label={`${courtNumber}コート`}
              labelStyle={styles.courtName}
              checked={item.canInsertNext}
            />
          ) : (
            <Text style={[styles.courtName]}>{courtNumber}コート</Text>
          )}
        </View>
        {generateMode === GenerateMode.FILL_ENPTY &&
          !isNoMatch &&
          canDelete &&
          !item.canInsertNext && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  ...globalStyles.touch,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={async () => {
                  let newGameRounds: GameRound[] = [];
                  setGameRounds((prev) => {
                    newGameRounds = prev.map((gameRound) => {
                      const newMatches = gameRound.matches.filter(
                        (match) =>
                          !(!match.isFinished && match.courtId === courtId),
                      );

                      return {
                        ...gameRound,
                        matches: newMatches,
                      };
                    });
                    return newGameRounds;
                  });
                  const newMatch = newGameRounds.flatMap(
                    (gameRound) => gameRound.matches,
                  );
                  const newPlayers: Player[] = countMatch(
                    newMatch,
                    players,
                    setPlayers,
                  );
                  if (setSwapPlayer) setSwapPlayer(null);

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
                    saveAt: new Date().getTime(),
                  });
                }}
              >
                <MaterialIcons name="delete-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
      </View>

      {item.teamA?.length === 0 || item.teamB?.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.vsText}>空きコート</Text>
        </View>
      ) : (
        <View style={styles.teams}>
          {/* チーム1 */}
          <View style={styles.team}>
            {item.teamA?.map((playerId) => {
              const partnerId = item.teamA.find((id) => id !== playerId);
              // console.log("playerId1", playerId);
              return (
                <MatchPlayer
                  key={playerId}
                  swapPlayer={swapPlayer}
                  playerId={playerId}
                  selectSwapPlayer={selectSwapPlayer}
                  partnerId={partnerId}
                  isSwap={
                    generateMode === GenerateMode.FILL_ENPTY
                      ? canSwap && !item.canInsertNext
                      : dispRound === gameRounds.length
                  }
                  showMatchCount={showMatchCount}
                  isFinished={item.canInsertNext}
                />
              );
            })}
          </View>

          <Text style={styles.vsText}>VS</Text>

          {/* チーム2 */}
          <View style={styles.team}>
            {item.teamB?.map((playerId) => {
              const partnerId = item.teamB.find((id) => id !== playerId);
              // console.log("playerId4", playerId);
              return (
                <MatchPlayer
                  key={playerId}
                  swapPlayer={swapPlayer}
                  playerId={playerId}
                  selectSwapPlayer={selectSwapPlayer}
                  partnerId={partnerId}
                  isSwap={
                    generateMode === GenerateMode.FILL_ENPTY
                      ? canSwap && !item.canInsertNext
                      : dispRound === gameRounds.length
                  }
                  showMatchCount={showMatchCount}
                  isFinished={item.canInsertNext}
                />
              );
            })}
          </View>
        </View>
      )}
    </Animated.View>
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  getGameCount: {
    flex: 1,
    fontSize: FONT_SIZE.small,
    marginRight: 8,
  },
  matchCard: {
    backgroundColor: ColorPalette.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finishedMatchCard: {
    backgroundColor: ColorPalette.finished2,
  },
  courtName: {
    fontSize: FONT_SIZE.small,
    fontWeight: "bold",
    color: ColorPalette.sectionTitie,
  },
  empty: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
    backgroundColor: ColorPalette.thirdry,
    borderColor: ColorPalette.secondary,
  },
  restingPlayerName: {
    flex: 4,
    marginLeft: 6,
    fontSize: FONT_SIZE.heading,
    color: ColorPalette.filterItemName,
    marginRight: 5,
  },
  restingSwapPlayerName: {
    flex: 2,
    color: ColorPalette.blackText,
  },
});

export default RenderMatch;
