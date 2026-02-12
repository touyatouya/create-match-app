import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { GenerateMode, Match as MatchType } from "@/types";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import CourtDeleteButton from "./courtDeleteButton";
import CourtTitle from "./courtTitle";
import MatchPlayer from "./matchPlayer";

interface MatchProps {
  item: MatchType;
  courtId: number;
  courtNumber: number;
}

const RenderMatch: React.FC<MatchProps> = ({ item, courtId, courtNumber }) => {
  const { gameRounds, generateMode, newGames, setNewGames, dispRound } =
    React.useContext(AppContext);

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
        generateMode === GenerateMode.FILL_EMPTY &&
          !isNoMatch && { paddingTop: 0, paddingBottom: 4 },
        generateMode === GenerateMode.FILL_EMPTY &&
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
        <CourtTitle item={item} courtId={courtId} courtNumber={courtNumber} />
        <CourtDeleteButton item={item} courtId={courtId} />
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
              return (
                <MatchPlayer
                  key={playerId}
                  matchId={item.id}
                  playerId={playerId}
                  partnerId={partnerId as number}
                  canSwap={
                    generateMode === GenerateMode.FILL_EMPTY
                      ? !item.canInsertNext
                      : dispRound === gameRounds.length
                  }
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
              return (
                <MatchPlayer
                  key={playerId}
                  matchId={item.id}
                  playerId={playerId}
                  partnerId={partnerId as number}
                  canSwap={
                    generateMode === GenerateMode.FILL_EMPTY
                      ? !item.canInsertNext
                      : dispRound === gameRounds.length
                  }
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
  courtName: {
    fontSize: FONT_SIZE.small,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
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
  vsText: {
    fontSize: FONT_SIZE.tiny,
    fontWeight: "bold",
    color: ColorPalette.filterItemName,
    marginHorizontal: 6,
  },
});

export default RenderMatch;
