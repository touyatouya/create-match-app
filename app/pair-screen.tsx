import { AppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  Button,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Pair, Player } from "../types";

const PairScreen: React.FC = () => {
  const { players, pairs, setPairs } = useContext(AppContext);
  const [pair, setPair] = useState<number[]>([]);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="ペア編集"
          onPress={() => alert("追加ボタンが押されました")}
        />
      ),
      // headerLeft: () => (
      //   <Button
      //     title="プレイヤー"
      //     onPress={() => alert("追加ボタンが押されました")}
      //   />
      // ),
    });
  }, [navigation]);

  const savePairs = async (
    pairs: { id: number; player1: number; player2: number }[]
  ) => {
    try {
      await AsyncStorage.setItem("pairs", JSON.stringify(pairs));
    } catch (e) {
      console.error("保存エラー:", e);
    }
  };

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
    savePairs(
      newPairs.map((pair) => {
        return { id: pair.id, player1: pair.player1, player2: pair.player2 };
      })
    );
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity onPress={() => selectPlayer(item.id)}>
      <View
        style={
          pair.some((p) => item.id === p)
            ? styles.joinPlayerItem
            : styles.restPlayerItem
        }
      >
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
        </View>
        {pair.some((p) => item.id === p) && (
          <View style={styles.joinBadge}>
            <Text style={styles.joinText}>選択中</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const NotPaierPlayer = players.filter(
    (player) =>
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
    savePairs(
      newPairs.map((pair) => {
        return { id: pair.id, player1: pair.player1, player2: pair.player2 };
      })
    );
  };

  const renderPair = ({ item }: { item: Pair }) => (
    <View style={styles.restPlayerItem}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>
          {players.find((player) => player.id === item.player1)?.name}
        </Text>
        <Text style={styles.playerName}>-</Text>
        <Text style={styles.playerName}>
          {players.find((player) => player.id === item.player2)?.name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removePair(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
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
              <View style={styles.restingHeader}>
                <View style={styles.restingTitle}>
                  <Ionicons name="cafe" size={24} color="#edab12" />
                  <Text style={styles.restingSectionTitle}>ペア一覧</Text>
                </View>
              </View>
            );
          } else if (section.type === "players") {
            return (
              <View style={styles.restingHeader}>
                <View style={styles.restingTitle}>
                  <Ionicons name="cafe" size={24} color="#edab12" />
                  <Text style={styles.restingSectionTitle}>
                    ペア未設定プレイヤー
                  </Text>
                </View>
              </View>
            );
          }
          return null;
        }}
        // contentContainerStyle={styles.sectionListContainer}
      />
      <TouchableOpacity style={styles.allPlayerButton} onPress={createPair}>
        <Text style={styles.addButtonText}>ペア作成</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  restingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  pairItem: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FFE8B2",
    flex: 1,
  },
  pairPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: "#664500",
    marginRight: 5,
  },
  allPlayerButton: {
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  count: {
    fontSize: 16,
    color: "#666",
  },
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  joinPlayerItem: {
    flexDirection: "row",
    backgroundColor: "hsl(50.96234309623431, 100%, 53.13725490196079%)",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  restPlayerItem: {
    flexDirection: "row",
    backgroundColor: "white",
    // backgroundColor: "#ccc4c4",
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  playerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  restingBadge: {
    backgroundColor: "#FFD166",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  restingText: {
    color: "#664500",
    fontSize: 20,
    fontWeight: "bold",
  },
  matchCountBadge: {
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  joinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  allJoinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  restBadge: {
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  matchCountText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  restText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  joinText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
    display: "flex",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  joinedPlayer: {
    marginBottom: 6,
  },
});

export default PairScreen;
