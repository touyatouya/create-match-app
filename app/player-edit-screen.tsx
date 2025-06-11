import { AppContext } from "@/context/AppContext";
import { Gender, Player, Rank } from "@/types";
import {
  AntDesign,
  FontAwesome5,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import {
  Alert,
  Button,
  InputAccessoryView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PlayerEditScreen: React.FC = () => {
  const { players, setPlayers, pairs, setPairs } = useContext(AppContext);
  const [newPlayerName, setNewPlayerName] = React.useState("");

  // 選択しているレベル
  // const [selected, setSelected] = useState<string | null>(null);
  // レベル選択モーダル
  // const [visible, setVisible] = useState(false);

  const textInputRef = useRef<TextInput>(null);

  const { playerId } = useLocalSearchParams();

  const id = Number(playerId);

  const savePlayerInfo = async (
    players: { id: number; name: string; gender: Gender; rank: Rank }[]
  ) => {
    try {
      await AsyncStorage.setItem("players", JSON.stringify(players));
    } catch (e) {
      console.error("保存エラー:", e);
    }
  };

  const player = players.find((player) => player.id === id);

  const router = useRouter();

  const playerName = player?.name;

  useEffect(() => {
    if (playerName != null) {
      setNewPlayerName(playerName);
    }
  }, [playerName]);

  const checkNameEmpty = () => {
    if (newPlayerName === "" || newPlayerName == null) {
      Alert.alert("名前を入力してください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
      // 少し遅らせてフォーカスを戻す（iOS対策）
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
      return;
    }
    textInputRef.current?.blur();
  };

  const updatePlayerName = () => {
    if (newPlayerName === "" || newPlayerName == null) {
      Alert.alert("名前を入力してください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
      // 少し遅らせてフォーカスを戻す（iOS対策）
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
      return;
    }

    let newPlayers: Player[] = [];
    setPlayers((prev) => {
      newPlayers = prev.map((player) => {
        if (player.id === id) {
          return {
            ...player,
            name: newPlayerName,
          };
        }
        return { ...player };
      });
      return newPlayers;
    });

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

  const updatePlayerNameAndBlur = () => {
    if (newPlayerName === "" || newPlayerName == null) {
      Alert.alert("名前を入力してください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
      // 少し遅らせてフォーカスを戻す（iOS対策）
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
      return;
    }
    setPlayers((prev) => {
      return prev.map((player) => {
        if (player.id === id) {
          return {
            ...player,
            name: newPlayerName,
          };
        }
        return { ...player };
      });
    });
    textInputRef.current?.blur();
  };

  const inputAccessoryViewID = "uniqueID2";

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

  const setSelectedGender = (gender: Gender) => {
    let newPlayers: Player[] = [];
    setPlayers((players) => {
      newPlayers = players.map((player) => {
        if (player.id === id) {
          return {
            ...player,
            gender: gender,
          };
        }
        return { ...player };
      });
      return newPlayers;
    });

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

  const releasePair = (id: number) => {
    setPairs((prev) =>
      prev.filter((pair) => pair.player1 !== id && pair.player2 !== id)
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "プレイヤー設定",
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
                プレイヤー
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.item}>
          <Ionicons
            name="person-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <View style={styles.info}>
            <Text style={styles.label}>プレイヤー名</Text>
            <View style={styles.addPlayerContainer}>
              <TextInput
                ref={textInputRef}
                style={styles.input}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                onSubmitEditing={updatePlayerName}
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
                    <Button title="キャンセル" onPress={checkNameEmpty} />
                    <Button title="完了" onPress={updatePlayerNameAndBlur} />
                  </View>
                </InputAccessoryView>
              )}
            </View>
          </View>
        </View>

        <View style={styles.item}>
          <FontAwesome5
            name="handshake"
            size={20}
            color="black"
            style={styles.icon}
          />
          <View style={styles.info}>
            <Text style={styles.label}>ペア</Text>
            {findPairPlayerId(id) ? (
              <Text style={styles.value}>
                {
                  players.find((player) => player.id === findPairPlayerId(id))
                    ?.name
                }
              </Text>
            ) : (
              <Text style={styles.value}>未設定</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => releasePair(id)}>
            <Text style={styles.link}>ペアを解除</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/pair-edit-screen",
                params: { playerId: id },
              })
            }
          >
            <Text style={styles.link}>ペアを選択</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Foundation name="male-female" size={24} color="black" />
          <View style={styles.info}>
            <Text style={styles.label}>性別</Text>
            <View style={styles.toggleContainer}>
              {Object.values(Gender).map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.button,
                    player?.gender === gender && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      player?.gender === gender && styles.selectedText,
                    ]}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#fefefe",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#999",
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  selectedButton: {
    backgroundColor: "#cce7ff",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    fontWeight: "bold",
    color: "#1c1c1c",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 5,
    backgroundColor: "#ccc",
    alignSelf: "flex-start",
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  // container: {
  //   padding: 24,
  // },
  selectButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
  },
  accessory: {
    backgroundColor: "#f2f2f2",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",

    // alignItems: "flex-end",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  addPlayerContainer: {
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    paddingVertical: 32,
  },
  icon: {
    width: 30,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    marginTop: 2,
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
  },
});
export default PlayerEditScreen;
