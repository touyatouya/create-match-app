import { AppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Pair, Player } from "../../types";

const PlayerScreen: React.FC = () => {
  const { players, setPlayers, pairs, setPairs } = useContext(AppContext);
  const [newPlayerName, setNewPlayerName] = React.useState("");

  // const clearStorage = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     Alert.alert("ローカルストレージがクリアされました");
  //   } catch (e) {
  //     Alert.alert("エラー", "ローカルストレージの削除に失敗しました");
  //   }
  // };

  useEffect(() => {
    const loadData = async () => {
      const playersData = await AsyncStorage.getItem("players");
      let playersDataLength: number = 0;
      if (playersData) playersDataLength = JSON.parse(playersData).length;

      if (playersData && playersDataLength > 0) {
        const parsedPlayers = JSON.parse(playersData);
        let players: Player[] = [];
        for (let i = 0; i < parsedPlayers.length; i++) {
          players.push({
            id: parsedPlayers[i].id,
            name: parsedPlayers[i].name,
            matchCount: 0,
            isJoin: false,
            isRest: false,
            teammatePlayerIds: [],
            opponentPlayerIds: [],
          });
        }
        setPlayers(players);
      }

      const pairsData = await AsyncStorage.getItem("pairs");
      let pairsLength: number = 0;
      if (pairsData) pairsLength = JSON.parse(pairsData).length;

      if (pairsData && pairsLength > 0) {
        const parsedPairs = JSON.parse(pairsData);
        let pairs: Pair[] = [];
        for (let i = 0; i < parsedPairs.length; i++) {
          pairs.push({
            id: parsedPairs[i].id,
            player1: parsedPairs[i].player1,
            player2: parsedPairs[i].player2,
          });
        }
        setPairs(pairs);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="ペア編集"
          onPress={() => router.push("/pair-screen")} // ← これでOK
        />
      ),
    });
  }, [navigation, router]);

  const savePlayerNames = async (players: { id: number; name: string }[]) => {
    try {
      await AsyncStorage.setItem("players", JSON.stringify(players));
    } catch (e) {
      console.error("保存エラー:", e);
    }
  };

  const addPlayer = (): void => {
    if (newPlayerName.trim() === "") return;
    let newPlayers: Player[] = [];

    setPlayers((prev) => {
      const playerIds = prev.map((player) => player.id);
      let newPlayerId: number;
      do {
        newPlayerId = Math.floor(Math.random() * 10000); // 0〜10000の自然数
      } while (playerIds.includes(newPlayerId));

      const newPlayer: Player = {
        id: newPlayerId,
        name: newPlayerName,
        matchCount: 0,
        isJoin: true,
        isRest: false,
        teammatePlayerIds: [],
        opponentPlayerIds: [],
      };

      newPlayers = [...prev, newPlayer];
      return newPlayers;
    });

    setNewPlayerName("");
    savePlayerNames(
      newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
        };
      })
    );
  };

  const removePlayer = (id: number): void => {
    let newPlayers: Player[] = [];
    setPlayers((prev) => {
      newPlayers = prev.filter((player) => player.id !== id);
      return newPlayers;
    });
    setNewPlayerName("");
    savePlayerNames(
      newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
        };
      })
    );
  };

  const joinPlayer = (id: number): void => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, isJoin: !player.isJoin } : player
    );
    setPlayers(updatedPlayers);
  };

  const joinedPlayer = players.filter((player) => player.isJoin);

  const joinAllPlayer = () => {
    const updatedPlayers = players.map((player) => {
      return { ...player, isJoin: true };
    });
    setPlayers(updatedPlayers);
  };

  const noJoinAllPlayer = () => {
    const updatedPlayers = players.map((player) => {
      return { ...player, isJoin: false };
    });
    setPlayers(updatedPlayers);
  };

  // const findPairPlayerId = (id: number) => {
  //   let isPlayer1 = false;
  //   let isPlayer2 = false;
  //   const pair = pairs.find((pair) => {
  //     isPlayer1 = pair.player1 === id;
  //     isPlayer2 = pair.player2 === id;
  //     return isPlayer1 || isPlayer2;
  //   });

  //   if (pair) {
  //     if (isPlayer1) return pair.player2;
  //     if (isPlayer2) return pair.player1;
  //   }
  // };

  const renderItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      onPress={() => joinPlayer(item.id)}
      // style={styles.removeButton}
    >
      <View style={item.isJoin ? styles.joinPlayerItem : styles.restPlayerItem}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          {/* {findPairPlayerId(item.id) && (
            <Text style={styles.playerName}>
              {
                players.find(
                  (player) => player.id === findPairPlayerId(item.id)
                )?.name
              }
            </Text>
          )} */}
        </View>
        {item.isJoin ? (
          <View style={styles.joinBadge}>
            <MaterialCommunityIcons
              name="human-handsup"
              size={24}
              color="white"
            />
            <Text style={styles.joinText}>参加中</Text>
          </View>
        ) : (
          <View style={styles.restBadge}>
            <MaterialCommunityIcons
              name="human-handsdown"
              size={24}
              color="black"
            />
            <Text style={styles.restText}>不参加</Text>
          </View>
        )}
        <View style={styles.matchCountBadge}>
          <Text style={styles.matchCountText}>試合: {item.matchCount}</Text>
        </View>
        <TouchableOpacity
          onPress={() => removePlayer(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="close-circle" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Button title="ローカルストレージを削除" onPress={clearStorage} /> */}
      <View style={styles.addPlayerContainer}>
        <TextInput
          style={styles.input}
          placeholder="プレイヤー名を入力して新規登録"
          placeholderTextColor="#999"
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          onSubmitEditing={addPlayer}
          autoCapitalize="words"
        />
        <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.joinedPlayer}>
        参加プレイヤー：{joinedPlayer.length}人
      </Text>
      <TouchableOpacity style={styles.allPlayerButton} onPress={joinAllPlayer}>
        <Text style={styles.addButtonText}>全プレイヤーを参加にする</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.allPlayerButton}
        onPress={noJoinAllPlayer}
      >
        <Text style={styles.addButtonText}>全プレイヤーを不参加にする</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={addPlayer}>
        <View style={styles.allJoinBadge}>
          <Text>全プレイヤーを参加にする</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={addPlayer}>
        <View style={styles.allJoinBadge}>
          <Text>全プレイヤーを不参加にする</Text>
        </View>
      </TouchableOpacity> */}
      <FlatList
        data={players}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            プレイヤーがいません。追加してください。
          </Text>
        }
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    display: "none",
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

export default PlayerScreen;
