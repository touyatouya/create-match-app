import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Player } from "@/types";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderSortButtonsProps {
  defaultOrderPlayers: Player[];
}

const HeaderSortButtons: React.FC<HeaderSortButtonsProps> = ({
  defaultOrderPlayers,
}) => {
  const { players, setPlayers } = useContext(AppContext);

  const sortJoin = () => {
    const sorted = [...players].sort((a, b) => {
      return (b.isJoin ? 1 : 0) - (a.isJoin ? 1 : 0);
    });
    setPlayers(sorted);
  };

  const resetOrder = () => {
    const playerWithIndex = players.map((player) => {
      return {
        ...player,
        defaultIndex: defaultOrderPlayers.findIndex(
          (defaultOrdepplayer) => defaultOrdepplayer.id === player.id
        ),
      };
    });

    const defaultPlayers = playerWithIndex.sort(
      (a, b) => a.defaultIndex - b.defaultIndex
    );

    const newPlayers = defaultPlayers.map(
      ({ defaultIndex, ...player }) => player
    );
    setPlayers(newPlayers);
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.button} onPress={sortJoin}>
        <Text style={styles.buttonText}>参加プレイヤーを上へ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetOrder}>
        <Text style={styles.buttonText}>並び順リセット</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", columnGap: 8, marginBottom: 8 },
  button: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: ColorPalette.secondary,
    borderWidth: 1,
    flex: 1,
    ...globalStyles.touch,
  },
  buttonText: {
    color: ColorPalette.secondary,
    fontWeight: 600,
  },
});

export default HeaderSortButtons;
