import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { useCourtToggle } from "@/features/match/hooks/useCourtToggle";
import { GenerateMode, Match as MatchType } from "@/types";
import Checkbox from "@/ui/CheckBox";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CourtTitleProps {
  item: MatchType;
  courtId: number;
  courtNumber: number;
}

const CourtTitle: React.FC<CourtTitleProps> = ({
  item,
  courtId,
  courtNumber,
}) => {
  const { generateMode, dispRound } = React.useContext(AppContext);

  const { toggleCourtCanInsertNext } = useCourtToggle();

  const isNoMatch =
    (item.teamA == null || item.teamA.length === 0) &&
    (item.teamB == null || item.teamB.length === 0);

  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      {generateMode === GenerateMode.FILL_EMPTY && !isNoMatch ? (
        <Checkbox
          onChange={() => toggleCourtCanInsertNext(courtId, dispRound)}
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
