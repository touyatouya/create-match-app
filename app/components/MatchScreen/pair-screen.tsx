import Colors from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
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
        <Ionicons name="close-circle" size={24} color={Colors.remove} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "ペア設定",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign name="left" size={24} color={Colors.link} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 16,
                  color: Colors.link,
                }}
              >
                プレイヤー
              </Text>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
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
                      color={Colors.normalIcon}
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
                      color={Colors.normalIcon}
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
    backgroundColor: Colors.primary,
    ...globalStyles.touch,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 12,
  },
  buttonText: {
    color: Colors.whiteText,
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
    color: Colors.sectionTitie,
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  allPlayerButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: Colors.whiteText,
    marginLeft: 8,
    fontWeight: "600",
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderline,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
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
    color: Colors.sectionTitie,
  },
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  list: {
    flex: 1,
  },
  playerItem: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingVertical: 14,
    paddingHorizontal: 4,
    ...globalStyles.touch,
  },
  selectedPlayerItem: {
    backgroundColor: Colors.secondary,
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
    color: Colors.whiteText,
  },
  playerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  matchCountBadge: {
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  selectedBadge: {
    flexDirection: "row",
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  allJoinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  matchCountText: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: "bold",
  },
  restText: {
    color: Colors.blackText,
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedText: {
    color: Colors.badgeText,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.emptyText,
    marginTop: 20,
  },
  joinedPlayer: {
    marginBottom: 6,
  },
});

export default PairScreen;
