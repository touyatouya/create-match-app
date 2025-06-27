import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { Player } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Checkbox from "../CheckBox";
import { playerScreenStyles } from "./styles";
import { Sort } from "./types";

interface PlayerTableHeaderProps {
  filteredPlayers: Player[];
  joinAllPlayer: () => void;
  noJoinAllPlayer: () => void;
  isSortedGender: Sort | null;
  sortGender: () => void;
  isSortedMatchCount: Sort | null;
  sortMatchCount: () => void;
}
const PlayerTableHeader: React.FC<PlayerTableHeaderProps> = ({
  filteredPlayers,
  joinAllPlayer,
  noJoinAllPlayer,
  isSortedGender,
  sortGender,
  isSortedMatchCount,
  sortMatchCount,
}) => {
  const isAllPlayerJoined = filteredPlayers.every((player) => player.isJoin);

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
          <AntDesign
            name={isSortedGender === "asc" ? "arrowup" : "arrowdown"}
            size={14}
            color={ColorPalette.normalIcon}
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
          <AntDesign
            name={isSortedMatchCount === "asc" ? "arrowup" : "arrowdown"}
            size={14}
            color={ColorPalette.normalIcon}
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
  },
  headerText: {
    fontWeight: 600,
    fontSize: FONT_SIZE.small,
  },
});

export default PlayerTableHeader;
