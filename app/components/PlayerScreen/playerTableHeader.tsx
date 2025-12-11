import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Gender, Player } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Checkbox from "../CheckBox";
import { playerScreenStyles } from "./styles";
import { Sort } from "./types";

interface PlayerTableHeaderProps {
  filteredPlayers: Player[];
  joinAllPlayer: () => void;
  noJoinAllPlayer: () => void;
}

const genderOrder = {
  [Gender.男性]: 1,
  [Gender.女性]: 2,
  [Gender.未設定]: 3,
};

const PlayerTableHeader: React.FC<PlayerTableHeaderProps> = ({
  filteredPlayers,
  joinAllPlayer,
  noJoinAllPlayer,
}) => {
  const { players, setPlayers } = useContext(AppContext);

  const [isSortedMatchCount, setIsSortedMatchCount] =
    React.useState<Sort | null>(null);
  const [isSortedGender, setIsSortedGender] = React.useState<Sort | null>(null);
  const isAllPlayerJoined = filteredPlayers.every((player) => player.isJoin);

  const sortMatchCount = () => {
    const nextSortOrder = isSortedMatchCount === "asc" ? "desc" : "asc";

    const sorted = [...players].sort((a, b) => {
      return nextSortOrder === "asc"
        ? a.matchCount - b.matchCount
        : b.matchCount - a.matchCount;
    });

    setIsSortedMatchCount(nextSortOrder);
    setPlayers(sorted);
  };

  const sortGender = () => {
    const nextSortOrder = isSortedGender === "asc" ? "desc" : "asc";

    const sorted = [...players].sort((a, b) => {
      return nextSortOrder === "asc"
        ? genderOrder[a.gender] - genderOrder[b.gender]
        : genderOrder[b.gender] - genderOrder[a.gender];
    });

    setIsSortedGender(nextSortOrder);
    setPlayers(sorted);
  };

  return (
    <View style={[playerScreenStyles.row, styles.headerRow]}>
      <Checkbox
        checked={filteredPlayers.length > 0 && isAllPlayerJoined}
        onChange={isAllPlayerJoined ? noJoinAllPlayer : joinAllPlayer}
      />
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View style={[playerScreenStyles.cellName, { flex: 7 }]}>
          <Text style={[styles.headerText]}>名前</Text>
        </View>
        <TouchableOpacity
          onPress={sortGender}
          style={[
            playerScreenStyles.cellGender,
            {
              ...globalStyles.touch,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.headerText]}>性別</Text>
          <MaterialIcons
            name={
              isSortedGender === "asc" ? "arrow-drop-up" : "arrow-drop-down"
            }
            size={20}
            color={ColorPalette.greyIcon2}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={sortMatchCount}
          style={[
            playerScreenStyles.cellMatch,
            {
              ...globalStyles.touch,
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.headerText]}>試合数</Text>
          <MaterialIcons
            name={
              isSortedMatchCount === "asc" ? "arrow-drop-up" : "arrow-drop-down"
            }
            size={20}
            color={ColorPalette.greyIcon2}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[playerScreenStyles.endIconButton, styles.headerText]}
      ></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    backgroundColor: ColorPalette.playerTabelHeader,
    borderBottomColor: ColorPalette.greyIcon1,
  },
  headerText: {
    fontWeight: 600,
    fontSize: FONT_SIZE.small,
  },
});

export default PlayerTableHeader;
