import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const PairScreen: React.FC = () => {
  const { players, pairs, setPairs } = useContext(AppContext);
  const [pair, setPair] = useState<number[]>([]);

  const router = useRouter();

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

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity
      onPress={() => selectPlayer(item.id)}
      style={[
        styles.playerItem,
        pair.some((p) => item.id === p) && styles.selectedPlayerItem,
      ]}
    >
      <Text
        style={[
          styles.playerName,
          pair.some((p) => item.id === p) && styles.selectedPlayerName,
        ]}
      >
        {item.name}
      </Text>
      {pair.some((p) => item.id === p) && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>選択中</Text>
        </View>
      )}
    </TouchableOpacity>
  );

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
      newPairs = prev.filter((player) => player.id !== id);
      return newPairs;
    });
  };

  const renderPair = ({ item }: { item: Pair }) => (
    <View style={[styles.playerItem, { paddingVertical: 6 }]}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {players.find((player) => player.id === item.player1)?.name}
        </Text>
        <Text style={styles.playerName}>・</Text>
        <Text style={styles.playerName}>
          {players.find((player) => player.id === item.player2)?.name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removePair(item.id)}
        style={[
          {
            ...globalStyles.touch,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Ionicons name="close-circle" size={24} color={ColorPalette.remove} />
      </TouchableOpacity>
    </View>
  );

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
              const pairs = item as Pair;
              return renderPair({ item: pairs }); // 例: カード表示など
            } else if (section.type === "players") {
              const player = item as Player;
              return renderPlayer({ item: player }); // 例: 名前だけ表示など
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
                <Text style={styles.emptyText}>ペアはありません</Text>
              ) : null;
            } else if (section.type === "players") {
              return sections.find((s) => s.type === "players")?.data.length ===
                0 ? (
                <Text style={styles.emptyText}>
                  参加中でペア未設定のプレイヤーはいません
                </Text>
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
    marginBottom: 12,
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 12,
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
  playerItem: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingVertical: 14,
    paddingHorizontal: 4,
    ...globalStyles.touch,
  },
  selectedPlayerItem: {
    backgroundColor: ColorPalette.secondary,
    paddingLeft: 14,
    paddingRight: 14,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    fontSize: 24,
    fontWeight: "500",
  },
  selectedPlayerName: {
    color: ColorPalette.whiteText,
  },
  selectedBadge: {
    flexDirection: "row",
    backgroundColor: ColorPalette.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  selectedText: {
    color: ColorPalette.badgeText,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: ColorPalette.emptyText,
  },
});

export default PairScreen;
