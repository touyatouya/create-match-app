import Colors from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { Filter, Player } from "@/types";
import { generateUniqId } from "@/utils/createId";
import { saveFilters } from "@/utils/saveStorage";
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

const CreateFilterScreen: React.FC = () => {
  const { players, setFilters } = useContext(AppContext);

  const [filter, setFilter] = useState<number[]>([]);
  const [showFilterCreated, setShowFilterCreated] = useState<boolean>(false);
  const [filterName, setFilterName] = React.useState("");
  const [filterNameError, setFilterNameError] = useState(false);
  const [noMemberSelected, setNoMemberSelected] = useState(false);

  const router = useRouter();

  const selectPlayer = (id: number) => {
    setFilter((prev) => {
      let newFilter = [];
      const isSelected = prev.some((playerId) => playerId === id);
      if (isSelected) {
        newFilter = prev.filter((playerId) => playerId !== id);
      } else {
        newFilter = [...prev, id];
      }
      return newFilter;
    });
  };

  const createFilter = () => {
    const isFilterNameEmpty = filterName.trim() === "";
    const isFilterEmpty = filter.length === 0;

    setFilterNameError(isFilterNameEmpty);
    setNoMemberSelected(isFilterEmpty);

    if (isFilterNameEmpty || isFilterEmpty) return;

    let newFilters: Filter[] = [];
    setFilters((prev) => {
      const ids = prev.flatMap((item) => item.id);
      const id = generateUniqId(ids);
      const newFilter = { id: id, name: filterName, players: filter };
      newFilters = [...prev, newFilter];
      return newFilters;
    });
    saveFilters(newFilters);
    showSuccessAndGoBack();
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity
      onPress={() => selectPlayer(item.id)}
      style={[
        styles.playerItem,
        filter.some((playerId) => playerId === item.id) &&
          styles.selectedPlayerItem,
      ]}
    >
      <Text
        style={[
          styles.playerName,
          filter.some((playerId) => playerId === item.id) &&
            styles.selectedPlayerName,
        ]}
      >
        {item.name}
      </Text>
      {filter.some((playerId) => playerId === item.id) && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>選択中</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const showSuccessAndGoBack = () => {
    setShowFilterCreated(true); // 一時的な表示フラグON

    setTimeout(() => {
      setShowFilterCreated(false); // フラグOFF
      router.back(); // or navigation.goBack()
    }, 1500); // 1.5秒で戻る
  };

  const clearInput = () => setFilterName("");

  const textInputRef = useRef<TextInputOrigin>(null);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "フィルター作成",
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
                フィルター設定
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <CompleteToast
        isOpen={showFilterCreated}
        message="フィルターを作成しました"
      />
      <View style={styles.container}>
        <View style={{ marginBottom: 8 }}>
          <TextInput
            ref={textInputRef}
            placeholder="フィルター名を入力"
            value={filterName}
            onChangeText={(text) => {
              setFilterName(text);
              setFilterNameError(false);
            }}
            onSubmitEditing={() => setFilterName}
            clearInput={clearInput}
            isError={filterNameError}
            errorMessage="フィルター名を入力してください。"
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
        <TouchableOpacity style={styles.button} onPress={createFilter}>
          <Text style={styles.buttonText}>フィルターを作成</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    paddingRight: 30,
  },
  validationText: {
    color: "red",
    marginVertical: 8,
    fontSize: 14,
  },
  playerName: {
    flex: 2,
    paddingHorizontal: 4,
    fontSize: 24,
  },
  selectedPlayerName: {
    color: Colors.whiteText,
  },
  playerItem: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
  },
  selectedPlayerItem: {
    backgroundColor: Colors.secondary,
    paddingLeft: 14,
    paddingRight: 14,
  },
  selectedBadge: {
    flexDirection: "row",
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  selectedText: {
    color: Colors.badgeText,
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.emptyText,
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 12,
    minHeight: 44,
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateFilterScreen;
