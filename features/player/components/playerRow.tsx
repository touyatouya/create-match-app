import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { playerScreenStyles } from "@/features/player/styles";
import { globalStyles } from "@/styles/global";
import { Player } from "@/types";
import Checkbox from "@/ui/CheckBox";
import GenderIcon from "@/ui/GenderIcon";
import RemoveButton from "@/ui/RemoveButton";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getMatchCount } from "../../../shared/logic/getMatchCount";

interface PlayerRowProps {
  item: Player;
  isEdit?: boolean;
  drag?: () => void;
  joinPlayer: (id: number) => void;
  removePlayer: (id: number) => void;
}
const PlayerRow: React.FC<PlayerRowProps> = ({
  item,
  isEdit,
  drag,
  joinPlayer,
  removePlayer,
}) => {
  const { gameRounds } = useContext(AppContext);
  const isJoin = item.isJoin;

  return (
    <View
      style={[
        playerScreenStyles.row,
        { borderBottomColor: ColorPalette.greyIcon1 },
        isJoin && { backgroundColor: ColorPalette.selected },
      ]}
    >
      {isEdit && <RemoveButton onPress={() => removePlayer(item.id)} />}
      {!isEdit && (
        <Checkbox checked={item.isJoin} onChange={() => joinPlayer(item.id)} />
      )}
      <TouchableOpacity
        onPress={isEdit ? undefined : () => joinPlayer(item.id)}
        style={styles.playerItem}
      >
        <Text style={[playerScreenStyles.cellName]}>{item.name}</Text>
        <Text
          style={[
            playerScreenStyles.cellGender,
            {
              textAlign: "center",
            },
          ]}
        >
          <GenderIcon gender={item.gender} />
        </Text>
        <Text style={[playerScreenStyles.cellMatch]}>
          {getMatchCount(item.id, gameRounds)}
        </Text>
      </TouchableOpacity>
      {isEdit ? (
        <TouchableOpacity
          onPressIn={drag}
          style={playerScreenStyles.endIconButton}
        >
          <MaterialIcons
            name="drag-handle"
            size={24}
            color={ColorPalette.normalIcon}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/Player/PlayerEdit",
              params: { playerId: item.id },
            })
          }
          style={playerScreenStyles.endIconButton}
        >
          <Entypo
            name="chevron-right"
            size={24}
            color={ColorPalette.greyIcon1}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  playerItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    ...globalStyles.touch,
  },
});

export default PlayerRow;
