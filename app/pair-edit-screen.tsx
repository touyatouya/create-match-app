import { AppContext } from "@/context/AppContext";
import { savePairs } from "@/utils/saveStorage";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Pair, Player } from "../types";
import CompleteToast from "./components/CompleteToast";

const PairScreen: React.FC = () => {
  const { players, pairs, setPairs } = useContext(AppContext);
  const [pairPlayer, setPairPlayer] = useState<number>();
  const [showPairUpdated, setShowPairUpdated] = useState<boolean>(false);

  const router = useRouter();

  const { playerId } = useLocalSearchParams();

  const id = Number(playerId);

  useEffect(() => {
    const pair = pairs.find(
      (pair) => pair.player1 === id || pair.player2 === id
    );
    if (pair != null) {
      const pairPlayer = pair.player1 === id ? pair.player2 : pair.player1;
      setPairPlayer(pairPlayer);
    }
  }, [id, pairs]);

  const selectPlayer = (id: number) => {
    setPairPlayer(id);
  };

  const createPair = () => {
    let newPairs: Pair[] = [];

    if (pairPlayer == null)
      return Alert.alert("ペアを選んでください", "", [
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
        id: newPairId,
        player1: id,
        player2: pairPlayer,
      };

      const removeOldPair = prev.filter(
        (pair) =>
          pair.player1 !== id &&
          pair.player1 !== pairPlayer &&
          pair.player2 !== id &&
          pair.player2 !== pairPlayer
      );
      newPairs = [...removeOldPair, newPair];
      return newPairs;
    });
    savePairs(
      newPairs.map((pair) => {
        return { id: pair.id, player1: pair.player1, player2: pair.player2 };
      })
    );
    showSuccessAndGoBack();
  };

  const findPairPlayerId = (id: number) => {
    let isPlayer1 = false;
    let isPlayer2 = false;
    const pair = pairs.find((pair) => {
      isPlayer1 = pair.player1 === id;
      isPlayer2 = pair.player2 === id;
      return isPlayer1 || isPlayer2;
    });

    if (pair) {
      if (isPlayer1) return pair.player2;
      if (isPlayer2) return pair.player1;
    }
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity onPress={() => selectPlayer(item.id)}>
      <View
        style={
          item.id === pairPlayer ? styles.joinPlayerItem : styles.restPlayerItem
        }
      >
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
        </View>
        {findPairPlayerId(item.id) && findPairPlayerId(item.id) !== id && (
          <View style={styles.pairInfo}>
            <FontAwesome5 name="handshake" size={18} color="black" />
            <Text style={styles.pairName}>
              {
                players.find(
                  (player) => player.id === findPairPlayerId(item.id)
                )?.name
              }
            </Text>
          </View>
        )}
        {item.id === pairPlayer && (
          <View style={styles.joinBadge}>
            <Text style={styles.joinText}>選択中</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const showSuccessAndGoBack = () => {
    setShowPairUpdated(true); // 一時的な表示フラグON

    setTimeout(() => {
      setShowPairUpdated(false); // フラグOFF
      router.back(); // or navigation.goBack()
    }, 1500); // 1.5秒で戻る
  };
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
              <AntDesign name="left" size={24} color="rgb(0, 122, 255)" />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 16,
                  color: "rgb(0, 122, 255)",
                }}
              >
                プレイヤー設定
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <CompleteToast isOpen={showPairUpdated} message="ペアを変更しました" />
      <View style={styles.container}>
        <FlatList
          data={players.filter((player) => player.id !== id)}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              プレイヤーがいません。追加してください。
            </Text>
          }
          style={styles.list}
        />
        <TouchableOpacity style={styles.allPlayerButton} onPress={createPair}>
          <Text style={styles.addButtonText}>ペア作成</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // 半透明背景（不要なら削除OK）
    zIndex: 9999,
  },
  centerToast: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toastText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  pairName: {
    justifyContent: "flex-start",
    fontSize: 16,
    fontWeight: "500",
  },
  pairInfo: {
    flexDirection: "row",
    flex: 2,
    fontSize: 20,
    fontWeight: "500",
    justifyContent: "flex-start",
    alignItems: "baseline",
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
