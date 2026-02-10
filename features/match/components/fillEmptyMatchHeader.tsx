import { AppContext } from "@/context/AppContext";
import React, { useContext } from "react";
import { View } from "react-native";
import { GenerateMode, Match as MatchType } from "../../../types";
import AllCourtCheckBox from "./allCourtCheckBox";
import HistoryButton from "./historyButton";

interface FillEmptyMatchHeaderProps {
  resetSwap: () => void;
}

const FillEmptyMatchHeader: React.FC<FillEmptyMatchHeaderProps> = ({
  resetSwap,
}) => {
  const { gameRounds, generateMode } = useContext(AppContext);

  const matches: MatchType[] = gameRounds.flatMap(
    (gameRound) => gameRound.matches,
  );

  if (generateMode !== GenerateMode.FILL_EMPTY || matches.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <AllCourtCheckBox resetSwap={resetSwap} />
      <HistoryButton />
    </View>
  );
};

export default FillEmptyMatchHeader;
