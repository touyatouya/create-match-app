import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Player } from "../../../types";
import RestCell from "./restCell";

interface MatchProps {
  item: Player[];
  dispRound: number;
}

const RestRow: React.FC<MatchProps> = ({ item, dispRound }) => {
  const { swap } = React.useContext(AppContext);
  return (
    <View style={styles.restingRow}>
      {item.map((player, idx) => (
        <View
          key={player.id}
          style={[
            styles.restingCell,
            idx === 0 ? { marginRight: 6 } : { marginLeft: 6 },
          ]}
        >
          <RestCell dispRound={dispRound} swap={swap} player={player} />
        </View>
      ))}
      {item.length === 1 && (
        <View style={[styles.restingCell, { marginLeft: 6 }]} />
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
  restingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  restingCell: {
    flex: 1,
  },
});

export default RestRow;
