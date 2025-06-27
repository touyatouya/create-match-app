import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Filter, Player } from "@/types";
import { generateUniqId } from "@/utils/createId";
import { saveFilters } from "@/utils/saveStorage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput as TextInputOrigin,
  TouchableOpacity,
  View,
} from "react-native";
import CompleteToast from "../CompleteToast";
import CustomHeader from "../CustomHeader";
import PrimaryButton from "../PrimaryButton";
import TextInput from "../TextInput";

const UpdateFilterScreen: React.FC = () => {
  const { players, filters, setFilters } = useContext(AppContext);

  const [filter, setFilter] = useState<number[]>([]);
  const [showFilterCreated, setShowFilterCreated] = useState<boolean>(false);
  const [filterName, setFilterName] = React.useState("");
  const [filterNameError, setFilterNameError] = useState(false);
  const [noMemberSelected, setNoMemberSelected] = useState(false);

  const router = useRouter();

  const { filterId } = useLocalSearchParams();
  const id = Number(filterId);

  const isEdit = filterId != null;

  const targetFilter = filters.find((filter) => filter.id === id);

  useEffect(() => {
    if (isEdit && targetFilter != null) {
      setFilter(targetFilter.players);
      setFilterName(targetFilter.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const updateFilter = () => {
    const isFilterNameEmpty = filterName.trim() === "";
    const isFilterEmpty = filter.length === 0;

    setFilterNameError(isFilterNameEmpty);
    setNoMemberSelected(isFilterEmpty);

    if (isFilterNameEmpty || isFilterEmpty) return;

    const ids = filters.flatMap((item) => item.id);
    const id = generateUniqId(ids);
    const newFilter = { id: id, name: filterName, players: filter };

    const newFilters: Filter[] = isEdit
      ? filters.map((item) => {
          if (item.id === id) {
            return {
              id: id,
              name: filterName,
              players: filter,
            };
          }
          return { ...item };
        })
      : [...filters, newFilter];

    setFilters(newFilters);
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
      <CustomHeader
        title={isEdit ? "フィルター編集" : "フィルター作成"}
        isSlideScreen
        headerLeftText="フィルター設定"
      />
      <CompleteToast
        isOpen={showFilterCreated}
        message={`フィルターを${isEdit ? "更新" : "作成"}しました`}
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
          <PrimaryButton
            text={`フィルターを${isEdit ? "更新" : "作成"}`}
            onPress={updateFilter}
          />
        </View>
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
  validationText: {
    color: ColorPalette.error,
    marginVertical: 8,
    fontSize: FONT_SIZE.small,
  },
  playerName: {
    flex: 2,
    paddingHorizontal: 4,
    fontSize: FONT_SIZE.title,
  },
  selectedPlayerName: {
    color: ColorPalette.whiteText,
  },
  playerItem: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
    ...globalStyles.touch,
  },
  selectedPlayerItem: {
    backgroundColor: ColorPalette.secondary,
    paddingLeft: 14,
    paddingRight: 14,
  },
  selectedBadge: {
    flexDirection: "row",
    backgroundColor: ColorPalette.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  selectedText: {
    color: ColorPalette.badgeText,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    color: ColorPalette.emptyText,
    marginTop: 20,
  },
});

export default UpdateFilterScreen;
