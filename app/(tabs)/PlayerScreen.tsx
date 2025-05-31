import { AppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Player } from "../../types";

const PlayerScreen: React.FC = () => {
  const { players, setPlayers, playerId, setPlayerId } = useContext(AppContext);
  const [newPlayerName, setNewPlayerName] = React.useState("");

  useEffect(() => {
    const loadName = async () => {
      const names = await AsyncStorage.getItem("playerNames");
      let namesLength: number = 0;
      if (names) namesLength = JSON.parse(names).length;

      if (names && namesLength > 0) {
        const parsedNames = JSON.parse(names);
        let players: Player[] = [];
        let lastPlayerId: number = 0;
        for (let i = 0; i < parsedNames.length; i++) {
          players.push({
            id: i,
            name: parsedNames[i],
            matchCount: 0,
            isJoin: false,
            isRest: false,
            teammatePlayerIds: [],
            opponentPlayerIds: [],
          });
          if (i === parsedNames.length - 1) lastPlayerId = i;
        }
        setPlayers(players);
        setPlayerId(lastPlayerId + 1);
      }
    };
    loadName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePlayerNames = async (players: string[]) => {
    try {
      await AsyncStorage.setItem("playerNames", JSON.stringify(players));
    } catch (e) {
      console.error("保存エラー:", e);
    }
  };

  const addPlayer = (): void => {
    if (newPlayerName.trim() === "") return;
    let newPlayers: Player[] = [];

    setPlayers((prev) => {
      const newPlayer: Player = {
        id: playerId,
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
    setPlayerId((prev) => prev + 1);
    savePlayerNames(newPlayers.map((player) => player.name));
  };

  const removePlayer = (id: number): void => {
    let newPlayers: Player[] = [];
    setPlayers((prev) => {
      newPlayers = prev.filter((player) => player.id !== id);
      return newPlayers;
    });
    setNewPlayerName("");
    savePlayerNames(newPlayers.map((player) => player.name));
  };

  const joinPlayer = (id: number): void => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, isJoin: !player.isJoin } : player
    );
    setPlayers(updatedPlayers);
  };

  const joinedPlayer = players.filter((player) => player.isJoin);

  const renderItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      onPress={() => joinPlayer(item.id)}
      // style={styles.removeButton}
    >
      <View style={item.isJoin ? styles.joinPlayerItem : styles.restPlayerItem}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
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
              name="human-handsup"
              size={24}
              color="black"
            />
            <Text style={styles.restText}>参加する</Text>
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
    padding: 16,
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
    padding: 16,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  restText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  joinText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
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
