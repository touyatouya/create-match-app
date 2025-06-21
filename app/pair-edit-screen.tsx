import Colors from "@/constants/color";
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
import { findPairPlayerId } from "./components/PlayerScreen/util";

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

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity onPress={() => selectPlayer(item.id)}>
      <View
        style={[
          styles.playerItem,
          item.id === pairPlayer && styles.selectedPlayerItem,
        ]}
      >
        <View style={styles.playerInfo}>
          <Text
            style={[
              styles.playerName,
              item.id === pairPlayer && styles.selectedPlayerName,
            ]}
          >
            {item.name}
          </Text>
        </View>
        {findPairPlayerId(item.id, pairs) &&
          findPairPlayerId(item.id, pairs) !== id && (
            <View style={styles.pairInfo}>
              <FontAwesome5
                name="handshake"
                size={18}
                color={Colors.normalIcon}
              />
              <Text style={styles.pairName}>
                {
                  players.find(
                    (player) => player.id === findPairPlayerId(item.id, pairs)
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
              <AntDesign name="left" size={24} color={Colors.link} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 16,
                  color: Colors.link,
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
    minHeight: 44,
  },
  addButtonText: {
    color: Colors.whiteText,
    marginLeft: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
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
    color: Colors.blackText,
  },
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  playerItem: {
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: Colors.background,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
  },
  selectedPlayerItem: {
    backgroundColor: Colors.secondary,
    paddingBottom: 14,
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
  joinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  joinText: {
    color: Colors.badgeText,
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
    display: "flex",
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
