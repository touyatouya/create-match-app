import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Pair, Player } from "../../../types";
import CustomHeader from "../CustomHeader";
import ListEmptyText from "../ListEmptyText";
import PairItem from "../PairItem";
import PlayerItem from "../PlayerItem";

const PairScreen: React.FC = () => {
  const { players, pairs, setPairs } = useContext(AppContext);
  const [pair, setPair] = useState<number[]>([]);

  const selectPlayer = (id: number) => {
    setPair((prev) => {
      let newPair: number[] = [];
      if (prev.some((p) => p === id)) {
        newPair = prev.filter((p) => p !== id);
      } else if (prev.length === 2) {
        newPair = [prev[0], id];
      } else {
        newPair = [...prev, id];
      }

      return newPair;
    });
  };

  const createPair = () => {
    let newPairs: Pair[] = [];

    if (pair.length !== 2)
      return Alert.alert("2人選んでください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);

    setPairs((prev) => {
      const pairIds = prev.map((pair) => pair.id);
      let newPairId: number;
      do {
        newPairId = Math.floor(Math.random() * 10000); // 1〜10000の自然数
      } while (pairIds.includes(newPairId));

      const newPair: Pair = {
        id: prev.length + 1,
        player1: pair[0],
        player2: pair[1],
      };
      newPairs = [...prev, newPair];
      return newPairs;
    });
    setPair([]);
  };

  const NotPaierPlayer = players.filter(
    (player) =>
      player.isJoin &&
      !pairs.find(
        (pair) => pair.player1 === player.id || pair.player2 === player.id
      )
  );

  type SectionDataItem = Pair | Player;

  type Section = {
    title: string;
    type: "pairs" | "players";
    data: SectionDataItem[];
  };

  const sections: Section[] = [
    {
      title: "",
      data: pairs,
      type: "pairs",
    },
    {
      title: "ペア未設定プレイヤー",
      data: NotPaierPlayer,
      type: "players",
    },
  ];

  const removePair = (id: number): void => {
    let newPairs: Pair[] = [];
    setPairs((prev) => {
      newPairs = prev.filter((pair) => pair.id !== id);
      return newPairs;
    });
  };

  return (
    <>
      <CustomHeader
        title="ペア設定"
        isSlideScreen
        headerLeftText="プレイヤー"
      />
      <View style={styles.container}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={({ item, section }) => {
            if (section.type === "pairs") {
              return (
                <PairItem
                  item={item as Pair}
                  onPressRemoveButton={() => removePair(item.id)}
                />
              );
            } else if (section.type === "players") {
              return (
                <PlayerItem
                  item={item as Player}
                  onPress={() => selectPlayer(item.id)}
                  isSelected={pair.some((p) => item.id === p)}
                  selectedText="選択中"
                />
              );
            }
            return null;
          }}
          renderSectionHeader={({ section }) => {
            if (section.type === "pairs") {
              return (
                <View style={styles.pairHeader}>
                  <View style={styles.restingTitle}>
                    <MaterialCommunityIcons
                      name="human-male-male"
                      size={24}
                      color={ColorPalette.normalIcon}
                    />
                    <Text style={styles.restingSectionTitle}>ペア一覧</Text>
                  </View>
                </View>
              );
            } else if (section.type === "players") {
              return (
                <View style={styles.playerHeader}>
                  <View style={styles.restingTitle}>
                    <MaterialCommunityIcons
                      name="human-male"
                      size={24}
                      color={ColorPalette.normalIcon}
                    />
                    <Text style={styles.restingSectionTitle}>
                      ペア未設定プレイヤー
                    </Text>
                  </View>
                </View>
              );
            }
            return null;
          }}
          renderSectionFooter={({ section }) => {
            if (section.type === "pairs") {
              return sections.find((s) => s.type === "pairs")?.data.length ===
                0 ? (
                <ListEmptyText message="ペアはありません" />
              ) : null;
            } else if (section.type === "players") {
              return sections.find((s) => s.type === "players")?.data.length ===
                0 ? (
                <ListEmptyText message="参加中でペア未設定のプレイヤーはいません" />
              ) : null;
            }
            return null;
          }}
        />
        <TouchableOpacity style={styles.button} onPress={createPair}>
          <Text style={styles.buttonText}>ペア作成</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorPalette.primary,
    ...globalStyles.touch,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 12,
  },
  buttonText: {
    color: ColorPalette.whiteText,
    fontSize: FONT_SIZE.body,
    fontWeight: "bold",
  },
  pairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ColorPalette.sectionTitie,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: ColorPalette.sectionTitie,
  },
});

export default PairScreen;
