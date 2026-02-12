import { AppContext } from "@/context/AppContext";
import { useDeleteMatchByCourt } from "@/features/match/hooks/useDeleteMatchByCourt";
import { globalStyles } from "@/styles/global";
import { GenerateMode, Match as MatchType } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface CourtDeleteButtonProps {
  item: MatchType;
  courtId: number;
}

const CourtDeleteButton: React.FC<CourtDeleteButtonProps> = ({
  item,
  courtId,
}) => {
  const { generateMode } = React.useContext(AppContext);

  const { deleteByCourt } = useDeleteMatchByCourt();

  const isNoMatch =
    (item.teamA == null || item.teamA.length === 0) &&
    (item.teamB == null || item.teamB.length === 0);

  if (
    generateMode !== GenerateMode.FILL_EMPTY ||
    isNoMatch ||
    item.canInsertNext
  ) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          ...globalStyles.touch,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => deleteByCourt(courtId)}
      >
        <MaterialIcons name="delete-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default CourtDeleteButton;
