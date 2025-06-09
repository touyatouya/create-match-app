import { AppContext } from "@/context/AppContext";
import { AntDesign, Foundation, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useRef } from "react";
import {
  Button,
  FlatList,
  InputAccessoryView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { Gender, Pair, Player, Rank } from "../../types";

const PlayerScreen: React.FC = () => {
  const { players, setPlayers, pairs, setPairs } = useContext(AppContext);
  const [newPlayerName, setNewPlayerName] = React.useState("");
  const [isEdit, setIsEdit] = React.useState(false);

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
            gender: parsedPlayers[i].gender,
            matchCount: 0,
            isJoin: false,
            isRest: false,
            rank: parsedPlayers[i].rank,
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
      headerRight: () =>
        isEdit || (
          <Button
            title="ペア編集"
            onPress={() => router.push("/pair-screen")} // ← これでOK
          />
        ),
      headerLeft: () =>
        isEdit ? (
          <Button
            title="完了"
            onPress={() => setIsEdit(false)} // ← これでOK
          />
        ) : (
          <Button
            title="編集"
            onPress={() => setIsEdit(true)} // ← これでOK
          />
        ),
    });
  }, [isEdit, navigation, router]);

  const savePlayerNames = async (
    players: { id: number; name: string; rank: Rank }[]
  ) => {
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
        gender: Gender.未設定,
        matchCount: 0,
        isJoin: true,
        isRest: false,
        rank: Rank.未設定,
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
          rank: player.rank,
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
          rank: player.rank,
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

  // ランク表示用関数
  // const dispRank = (rank: Rank) => {
  //   if (rank === Rank.A) return "A";
  //   if (rank === Rank.B) return "B";
  //   if (rank === Rank.C) return "C";
  //   if (rank === Rank.D) return "D";
  //   if (rank === Rank.E) return "E";
  //   else return "";
  // };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cellName, styles.headerText]}>名前</Text>
      <Text style={[styles.cellGender, styles.headerText]}>性別</Text>
      {/* <Text style={[styles.cellRank, styles.headerText]}>ランク</Text> */}
      <Text style={[styles.cellPair, styles.headerText]}>ペア</Text>
      <Text style={[styles.cellMatch, styles.headerText]}>試合数</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Player }) => (
    <View style={styles.row}>
      <View
        style={{
          padding: 0,
          backgroundColor: item.isJoin ? "#007AFF" : "#f0f0f0",
          borderRadius: "50%",
          borderWidth: item.isJoin ? 0 : 1,
          borderColor: item.isJoin ? "none" : "#f0f0f0",
        }}
      >
        <Checkbox
          status={item.isJoin ? "checked" : "unchecked"}
          onPress={() => joinPlayer(item.id)}
          color="white" // ✅ チェック時の色
        />
      </View>
      <Text style={styles.cellName}>{item.name}</Text>
      <Text style={styles.cellName}>
        {item.gender === Gender.男性 ? (
          <Foundation name="male" size={24} color="blue" />
        ) : item.gender === Gender.女性 ? (
          <Foundation name="female" size={24} color="red" />
        ) : (
          ""
        )}
      </Text>
      {/* <Text style={styles.cellRank}>{dispRank(item.rank)}</Text> */}
      <Text style={styles.cellPair}>
        {findPairPlayerId(item.id) && (
          <View style={styles.pairInfo}>
            <Text style={styles.pairName}>
              {
                players.find(
                  (player) => player.id === findPairPlayerId(item.id)
                )?.name
              }
            </Text>
          </View>
        )}
      </Text>
      <Text style={styles.cellMatch}>{item.matchCount}</Text>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/player-edit-screen",
            params: { playerId: item.id },
          })
        }
        style={styles.removeButton}
      >
        <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const inputAccessoryViewID = "uniqueID";
  const textInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      {/* <Button title="ローカルストレージを削除" onPress={clearStorage} /> */}
      <View style={styles.addPlayerContainer}>
        <TextInput
          ref={textInputRef}
          style={styles.input}
          placeholder="プレイヤー名を入力して新規登録"
          placeholderTextColor="#999"
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          onSubmitEditing={addPlayer}
          autoCapitalize="words"
          inputAccessoryViewID={
            Platform.OS === "ios" ? inputAccessoryViewID : undefined
          }
          returnKeyType="done"
        />
        {/* iOS限定: キーボード上に完了ボタンを表示 */}
        {Platform.OS === "ios" && (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <View style={styles.accessory}>
              <Button
                title="キャンセル"
                onPress={() => {
                  textInputRef.current?.blur(); // キーボードを閉じる
                }}
              />
              <Button
                title="完了"
                onPress={() => {
                  addPlayer();
                  textInputRef.current?.blur(); // キーボードを閉じる
                }}
              />
            </View>
          </InputAccessoryView>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            addPlayer();
            textInputRef.current?.blur(); // キーボードを閉じる
          }}
        >
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
      {renderHeader()}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  // 行全体：横並び
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
  },
  // 共通セル
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonCell: {
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  // それぞれのセル幅（flex値を統一する）
  cellName: {
    flex: 2, // 名前は横幅を広めに取る
    paddingHorizontal: 4,
    fontSize: 20,
    // fontWeight: "bold",
  },
  cellGender: {
    flex: 1, // ランクは幅を狭く
    paddingHorizontal: 4,
    fontSize: 16,
  },
  cellPair: {
    flex: 2, // ペアも少し広め
    paddingHorizontal: 4,
    fontSize: 16,
  },
  cellMatch: {
    flex: 1, // 試合数は狭め
    paddingHorizontal: 4,
    textAlign: "center",
    fontSize: 16,
  },
  cellStatus: {
    flex: 1.2, // 状態ボタン用に少し広め
    paddingHorizontal: 4,
    height: 32,
    borderRadius: 4,
  },
  cellEdit: {
    flex: 1, // 編集ボタン用
    paddingHorizontal: 4,
    height: 32,
    borderRadius: 4,
  },
  accessory: {
    backgroundColor: "#f2f2f2",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#ccc",
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
  cell: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    borderRadius: 4,
    alignItems: "center",
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
  restPlayerItem: {
    flexDirection: "row",
    backgroundColor: "white",
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
  playerName: {
    flex: 3,
    fontSize: 18,
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
  pairName: {
    justifyContent: "flex-start",
    fontSize: 16,
    fontWeight: "500",
  },
  matchCountBadge: {
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
  },
  joinBadge: {
    flexDirection: "row",
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
  },
  restBadge: {
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
  },
  matchCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  restText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  joinText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
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

export default PlayerScreen;
