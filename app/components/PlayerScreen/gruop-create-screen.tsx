import { AppContext } from "@/context/AppContext";
import { Group, Player } from "@/types";
import { generateUniqId } from "@/utils/createId";
import { saveGroups } from "@/utils/saveStorage";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput as TextInputOrigin,
  TouchableOpacity,
  View,
} from "react-native";
import CompleteToast from "../CompleteToast";
import TextInput from "../TextInput";
import Toggle from "../Toggle";

const CreateGroupScreen: React.FC = () => {
  const { players, setGroups } = useContext(AppContext);

  const [group, setGroup] = useState<number[]>([]);
  const [showGroupCreated, setShowGroupCreated] = useState<boolean>(false);
  const [groupName, setGroupName] = React.useState("");
  const [groupNameError, setGroupNameError] = useState(false);
  const [noMemberSelected, setNoMemberSelected] = useState(false);

  const router = useRouter();

  const selectPlayer = (id: number) => {
    setGroup((prev) => {
      let newGroup = [];
      const isSelected = prev.some((playerId) => playerId === id);
      if (isSelected) {
        newGroup = prev.filter((playerId) => playerId !== id);
      } else {
        newGroup = [...prev, id];
      }
      return newGroup;
    });
  };

  const createGroup = () => {
    const isGroupNameEmpty = groupName.trim() === "";
    const isGroupEmpty = group.length === 0;

    setGroupNameError(isGroupNameEmpty);
    setNoMemberSelected(isGroupEmpty);

    if (isGroupNameEmpty || isGroupEmpty) return;

    let newGroups: Group[] = [];
    setGroups((prev) => {
      const ids = prev.flatMap((item) => item.id);
      const id = generateUniqId(ids);
      const newGroup = { id: id, name: groupName, players: group };
      newGroups = [...prev, newGroup];
      return newGroups;
    });
    saveGroups(newGroups);
    showSuccessAndGoBack();
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => selectPlayer(item.id)}
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      >
        <Text style={styles.cellName}>{item.name}</Text>
        <Toggle
          checked={group.some((playerId) => playerId === item.id)}
          onChange={() => selectPlayer(item.id)}
        />
      </TouchableOpacity>
    </View>
  );

  const showSuccessAndGoBack = () => {
    setShowGroupCreated(true); // 一時的な表示フラグON

    setTimeout(() => {
      setShowGroupCreated(false); // フラグOFF
      router.back(); // or navigation.goBack()
    }, 1500); // 1.5秒で戻る
  };

  const clearInput = () => setGroupName("");

  const textInputRef = useRef<TextInputOrigin>(null);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "グループ作成",
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
                グループ設定
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <CompleteToast
        isOpen={showGroupCreated}
        message="グループを作成しました"
      />
      <View style={styles.container}>
        <View style={{ marginBottom: 8 }}>
          <TextInput
            ref={textInputRef}
            placeholder="グループ名を入力"
            value={groupName}
            onChangeText={(text) => {
              setGroupName(text);
              setGroupNameError(false);
            }}
            onSubmitEditing={() => setGroupName}
            clearInput={clearInput}
            isError={groupNameError}
            errorMessage="グループ名を入力してください。"
          />
        </View>
        <Text>メンバー選択</Text>
        {noMemberSelected && (
          <Text style={styles.validationText}>
            1人以上のメンバーを選択してください。
          </Text>
        )}
        <View style={styles.listContainer}>
          <FlatList
            data={players}
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
        </View>
        <TouchableOpacity style={styles.button} onPress={createGroup}>
          <Text style={styles.buttonText}>グループを作成</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  listContainer: {
    flex: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    paddingRight: 30,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  validationText: {
    color: "red",
    marginVertical: 8,
    fontSize: 14,
  },
  cellName: {
    flex: 2, // 名前は横幅を広めに取る
    paddingHorizontal: 4,
    fontSize: 20,
    // fontWeight: "bold",
  },
  row: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateGroupScreen;
