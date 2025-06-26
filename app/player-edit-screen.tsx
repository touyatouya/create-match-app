import Colors from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Gender, Player } from "@/types";
import { savePlayerInfo } from "@/utils/saveStorage";
import { AntDesign, Foundation, Ionicons } from "@expo/vector-icons";
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
import GenderToggle from "./components/GenderToggle";

const PlayerEditScreen: React.FC = () => {
  const { players, setPlayers } = useContext(AppContext);
  const [newPlayerName, setNewPlayerName] = React.useState("");

  // 選択しているレベル
  // const [selected, setSelected] = useState<string | null>(null);
  // レベル選択モーダル
  // const [visible, setVisible] = useState(false);

  const textInputRef = useRef<TextInput>(null);

  const { playerId } = useLocalSearchParams();

  const id = Number(playerId);

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
              <AntDesign name="left" size={24} color={Colors.link} />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: FONT_SIZE.body,
                  color: Colors.link,
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
            color={Colors.normalIcon}
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
          <Foundation name="male-female" size={24} color={Colors.normalIcon} />
          <View style={styles.info}>
            <Text style={styles.label}>性別</Text>
            <GenderToggle
              value={player?.gender as Gender}
              setGender={setSelectedGender}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonArea: {
    marginTop: 8,
    flexDirection: "row",
    columnGap: 16,
  },
  selectPairButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    ...globalStyles.touch,
  },
  selectPairButtonText: {
    color: Colors.whiteText,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.toggleBorder,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: 24,
    borderRadius: 12,
    width: "80%",
    elevation: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  accessory: {
    backgroundColor: Colors.accessoryBackground,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: Colors.accessoryborderColor,
  },
  container: {
    flex: 1,
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
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderline,
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
    fontSize: FONT_SIZE.small,
  },
  value: {
    fontSize: FONT_SIZE.body,
    marginTop: 2,
  },
  link: {
    color: Colors.link,
    fontSize: FONT_SIZE.small,
  },
});
export default PlayerEditScreen;
