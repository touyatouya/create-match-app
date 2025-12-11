import CustomHeader from "@/app/components/CustomHeader";
import GenderToggle from "@/app/components/GenderToggle";
import MyAdmob, { BannerAdSize } from "@/app/components/MyAdmob";
import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { Gender, Player } from "@/types";
import { savePlayerInfo } from "@/utils/saveStorage";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useRef } from "react";
import {
  Alert,
  Button,
  InputAccessoryView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const PlayerEditScreen: React.FC = () => {
  const { players, setPlayers } = useContext(AppContext);
  const [newPlayerName, setNewPlayerName] = React.useState("");

  const textInputRef = useRef<TextInput>(null);

  const { playerId } = useLocalSearchParams();

  const id = Number(playerId);

  const player = players.find((player) => player.id === id);

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
            isAnonymous: false,
            anonymousNumber: null,
          };
        }
        return { ...player };
      });
      return newPlayers;
    });

    savePlayerInfo(
      newPlayers
        .filter((p) => !p.isAnonymous)
        .map((player) => {
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
            isAnonymous: false,
            anonymousNumber: null,
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
      newPlayers
        .filter((p) => !p.isAnonymous)
        .map((player) => {
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
      <CustomHeader
        title="プレイヤー設定"
        isSlideScreen
        headerLeftText="プレイヤー"
      />
      <View style={styles.container}>
        <View style={styles.item}>
          <Ionicons
            name="person-outline"
            size={24}
            color={ColorPalette.normalIcon}
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
              {/* iOS限定: キーボード上にボタンを表示 */}
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
          <Foundation
            name="male-female"
            size={24}
            color={ColorPalette.normalIcon}
          />
          <View style={styles.info}>
            <Text style={styles.label}>性別</Text>
            <GenderToggle
              value={player?.gender as Gender}
              setGender={setSelectedGender}
            />
          </View>
        </View>
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </>
  );
};

const styles = StyleSheet.create({
  accessory: {
    backgroundColor: ColorPalette.accessoryBackground,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: ColorPalette.accessoryborderColor,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addPlayerContainer: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: ColorPalette.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: ColorPalette.background,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ColorPalette.borderline,
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
    color: ColorPalette.link,
    fontSize: FONT_SIZE.small,
  },
});
export default PlayerEditScreen;
