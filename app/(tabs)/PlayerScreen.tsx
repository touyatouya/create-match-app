import { AppContext } from "@/context/AppContext";
import { savePlayerInfo } from "@/utils/saveStorage";
import { AntDesign, Foundation } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Gender, Pair, Player, Rank } from "../../types";
import Checkbox from "../components/CheckBox";
import { findPairPlayerId } from "../components/PlayerScreen/util";
import TextInput from "../components/TextInput";

type Sort = "asc" | "desc";

const PlayerScreen: React.FC = () => {
  const { players, setPlayers, pairs, setPairs } = useContext(AppContext);
  const [newPlayerName, setNewPlayerName] = React.useState("");
  const [isEdit, setIsEdit] = React.useState(false);
  const [isSortedMatchCount, setIsSortedMatchCount] =
    React.useState<Sort | null>(null);
  const [isSortedGender, setIsSortedGender] = React.useState<Sort | null>(null);
  const [isSortedPair, setIsSortedPair] = React.useState<Sort | null>(null);

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
            title="グループ編集"
            onPress={() => router.push("/components/PlayerScreen/group-screen")}
          />
        ),
      headerLeft: () =>
        isEdit ? (
          <Button title="完了" onPress={() => setIsEdit(false)} />
        ) : (
          <Button title="編集" onPress={() => setIsEdit(true)} />
        ),
    });
  }, [isEdit, navigation, router]);

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
    savePlayerInfo(
      newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
          gender: player.gender,
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
    savePlayerInfo(
      newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
          gender: player.gender,
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

  const sortMatchCount = () => {
    let sorted: Player[] = [];
    setIsSortedMatchCount((prev) => {
      sorted = [...players].sort((a, b) => {
        if (prev === "asc") {
          return b.matchCount - a.matchCount;
        } else {
          return a.matchCount - b.matchCount;
        }
      });
      return prev === "asc" ? "desc" : "asc";
    });
    setPlayers(sorted);
  };

  const genderOrder = {
    [Gender.男性]: 1,
    [Gender.女性]: 2,
    [Gender.未設定]: 3,
  };

  const sortGender = () => {
    let sorted: Player[] = [];
    setIsSortedGender((prev) => {
      sorted = [...players].sort((a, b) => {
        if (prev === "asc") {
          return genderOrder[b.gender] - genderOrder[a.gender];
        } else {
          return genderOrder[a.gender] - genderOrder[b.gender];
        }
      });
      return prev === "asc" ? "desc" : "asc";
    });
    setPlayers(sorted);
  };
  const sortPair = () => {
    let sorted: Player[] = [];
    setIsSortedPair((prev) => {
      sorted = [...players].sort((a, b) => {
        const pairA = pairs.find(
          (pair) => pair.player1 === a.id || pair.player2 === a.id
        );
        const pairB = pairs.find(
          (pair) => pair.player1 === b.id || pair.player2 === b.id
        );

        const hasPairA = pairA ? 1 : 0;
        const hasPairB = pairB ? 1 : 0;

        if (prev === "asc") {
          return hasPairB - hasPairA;
        } else {
          return hasPairA - hasPairB;
        }
      });
      return prev === "asc" ? "desc" : "asc";
    });
    setPlayers(sorted);
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Checkbox
        checked={players.every((player) => player.isJoin)}
        onChange={
          players.every((player) => player.isJoin)
            ? noJoinAllPlayer
            : joinAllPlayer
        }
      />
      <Text style={[styles.cellName, styles.headerText]}>名前</Text>
      <TouchableOpacity onPress={sortGender} style={[styles.cellGender]}>
        <Text style={[styles.headerText]}>性別</Text>
        <AntDesign
          name={isSortedGender === "asc" ? "arrowup" : "arrowdown"}
          size={16}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={sortPair} style={[styles.cellPair]}>
        <Text style={[styles.headerText]}>ペア</Text>
        <AntDesign
          name={isSortedPair === "asc" ? "arrowup" : "arrowdown"}
          size={16}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={sortMatchCount} style={[styles.cellMatch]}>
        <Text style={[styles.headerText]}>試合数</Text>
        <AntDesign
          name={isSortedMatchCount === "asc" ? "arrowup" : "arrowdown"}
          size={16}
          color="black"
        />
      </TouchableOpacity>
      <Text style={[styles.removeButton, styles.headerText]}></Text>
    </View>
  );

  const renderItem = ({ item }: { item: Player }) => (
    <View style={styles.row}>
      {isEdit && (
        <TouchableOpacity
          onPress={() => removePlayer(item.id)}
          style={styles.removeButton}
        >
          <AntDesign name="minuscircle" size={24} color="red" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => joinPlayer(item.id)}
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      >
        {isEdit || (
          <Checkbox
            checked={item.isJoin}
            onChange={() => joinPlayer(item.id)}
          />
        )}
        <Text style={styles.cellName}>{item.name}</Text>
        <Text style={styles.cellGender}>
          {item.gender === Gender.男性 ? (
            <Foundation name="male" size={24} color="blue" />
          ) : item.gender === Gender.女性 ? (
            <Foundation name="female" size={24} color="red" />
          ) : (
            ""
          )}
        </Text>
        <Text style={styles.cellPair}>
          {findPairPlayerId(item.id, pairs) && (
            <View style={styles.pairInfo}>
              <Text style={styles.pairName}>
                {
                  players.find(
                    (player) => player.id === findPairPlayerId(item.id, pairs)
                  )?.name
                }
              </Text>
            </View>
          )}
        </Text>
        <Text style={styles.cellMatch}>{item.matchCount}</Text>
      </TouchableOpacity>
      {isEdit || (
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
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Button title="ローカルストレージを削除" onPress={clearStorage} /> */}
      <View style={styles.addPlayerContainer}>
        <TextInput
          placeholder="プレイヤー名を入力して新規登録"
          value={newPlayerName}
          onChangeText={() => setNewPlayerName}
          onSubmitEditing={addPlayer}
          clearInput={() => setNewPlayerName("")}
        />
      </View>
      <Text style={styles.joinedPlayer}>
        参加プレイヤー：{joinedPlayer.length}人
      </Text>
      {renderHeader()}
      <SwipeListView
        data={players}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            プレイヤーがいません。追加してください。
          </Text>
        }
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <Pressable onPress={() => removePlayer(item.id)}>
              <Text style={styles.deleteText}>削除</Text>
            </Pressable>
          </View>
        )}
        rightOpenValue={-65}
        disableRightSwipe
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: 20,
    textAlign: "center",
    // paddingVertical: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
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
    backgroundColor: "white",
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
    fontSize: 14,
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
    flexDirection: "row",
    justifyContent: "center",
  },
  cellPair: {
    flex: 2, // ペアも少し広め
    paddingHorizontal: 4,
    fontSize: 16,
    justifyContent: "center",
    flexDirection: "row",
  },
  cellMatch: {
    flex: 1, // 試合数は狭め
    paddingHorizontal: 4,
    textAlign: "center",
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  list: {
    flex: 1,
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
