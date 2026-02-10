import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { GenerateMode, Match as MatchType } from "@/types";
import Checkbox from "@/ui/CheckBox";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useResetSwap } from "../hooks/useResetSwap";

interface CourtTitleProps {
  item: MatchType;
  courtId: number;
  courtNumber: number;
  canCheck: boolean;
}

const CourtTitle: React.FC<CourtTitleProps> = ({
  item,
  courtId,
  courtNumber,
  canCheck,
}) => {
  const { setGameRounds, generateMode, dispRound } =
    React.useContext(AppContext);

  const { resetSwap } = useResetSwap();

  const isNoMatch =
    (item.teamA == null || item.teamA.length === 0) &&
    (item.teamB == null || item.teamB.length === 0);

  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      {generateMode === GenerateMode.FILL_EMPTY && !isNoMatch && canCheck ? (
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
            resetSwap();
          }}
          label={`${courtNumber}コート`}
          labelStyle={styles.courtName}
          checked={item.canInsertNext}
        />
      ) : (
        <Text style={[styles.courtName]}>{courtNumber}コート</Text>
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
  courtName: {
    fontSize: FONT_SIZE.small,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
  },
});

export default CourtTitle;
