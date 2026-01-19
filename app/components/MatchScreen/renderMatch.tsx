import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { GenerateMode, Match as MatchType, Player } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MatchPlayer from "./matchPlayer";

interface MatchProps {
  item: MatchType;
  courtMatch: MatchType[];
  courtId: number;
  courtNumber: number;
  swapPlayer: number | null;
  setSwapPlayer?: React.Dispatch<React.SetStateAction<number | null>>;
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
  const { gameRounds, setGameRounds, generateMode, players, setPlayers } =
    React.useContext(AppContext);

  const playersId = players.map((p: Player) => p.id);

  const isNoMatch =
    (item.teamA == null || item.teamA.length === 0) &&
    (item.teamB == null || item.teamB.length === 0);

  return (
    <View
      style={[
        styles.matchCard,
        (item.canInsertNext || isNoMatch) && styles.finishedMatchCard,
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
          <Text style={styles.courtName}>{courtNumber}コート</Text>
          {!isNoMatch && canCheck ? (
            <TouchableOpacity
              onPress={() =>
                setGameRounds((prev) => {
                  return prev.map((gameRound, i) => {
                    const newMatches = gameRound.matches.map((match) => {
                      if (!match.canInsertNext && match.courtId === courtId) {
                        // console.log("dispRound:", dispRound);
                        return {
                          ...match,
                          canInsertNext: true,
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
                })
              }
              style={{
                backgroundColor: ColorPalette.thirdry,
                borderRadius: 20,
                padding: 4,
                marginLeft: 8,
                justifyContent: "center",
                alignItems: "center",

                ...globalStyles.touch,
              }}
            >
              <Text>試合終了</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                borderRadius: 20,
                padding: 4,
                marginLeft: 8,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                ...globalStyles.touch,
              }}
            >
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                空きコート
              </Text>
            </View>
          )}
        </View>
        {!isNoMatch && canDelete && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {generateMode === GenerateMode.REPLACEE_ALL &&
            gameRounds[dispRound] != null ? (
              <View style={{ ...globalStyles.touch }}></View>
            ) : (
              <TouchableOpacity
                style={{
                  ...globalStyles.touch,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={async () => {
                  setGameRounds((prev) => {
                    return prev.map((gameRound, i) => {
                      const newMatches = gameRound.matches.filter(
                        (match) =>
                          !(!match.isFinished && match.courtId === courtId),
                      );

                      return {
                        ...gameRound,
                        matches: newMatches,
                      };
                    });
                  });
                  setPlayers((prev) => {
                    return prev.map((player) => {
                      return {
                        ...player,
                        isRest: false,
                        matchCount: 0,
                      };
                    });
                  });
                  if (setSwapPlayer) setSwapPlayer(null);
                }}
              >
                <MaterialIcons name="delete-outline" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

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
                    ? canSwap
                    : dispRound === gameRounds.length
                }
                showMatchCount={showMatchCount}
                isSelect={false}
                team="teamA"
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
                    ? canSwap
                    : dispRound === gameRounds.length
                }
                showMatchCount={showMatchCount}
                isSelect={false}
                team="teamB"
              />
            );
          })}
        </View>
      </View>
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
    marginBottom: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  finishedMatchCard: {
    backgroundColor: ColorPalette.disabled,
  },
  courtName: {
    fontSize: FONT_SIZE.small,
    fontWeight: "bold",
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
