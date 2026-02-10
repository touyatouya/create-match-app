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
  canDelete: boolean;
}

const CourtDeleteButton: React.FC<CourtDeleteButtonProps> = ({
  item,
  courtId,
  canDelete,
}) => {
  const { generateMode } = React.useContext(AppContext);

  const { deleteByCourt } = useDeleteMatchByCourt();

  const isNoMatch =
    (item.teamA == null || item.teamA.length === 0) &&
    (item.teamB == null || item.teamB.length === 0);

  if (
    generateMode !== GenerateMode.FILL_EMPTY ||
    isNoMatch ||
    !canDelete ||
    item.canInsertNext
  ) {
    return null;
  }

  const handleDelete = async () => {
    deleteByCourt(courtId);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          ...globalStyles.touch,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => handleDelete()}
      >
        <MaterialIcons name="delete-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default CourtDeleteButton;
