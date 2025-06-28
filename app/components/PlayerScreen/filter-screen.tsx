import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { saveFilters } from "@/utils/saveStorage";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Filter } from "../../../types";
import CustomHeader from "../CustomHeader";
import ListEmptyText from "../ListEmptyText";
import RemoveButton from "../RemoveButton";

const FilterScreen: React.FC = () => {
  const { filters, setFilters } = useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);

  const router = useRouter();

  const renderFilter = ({ item }: { item: Filter }) => (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() =>
          isEdit ||
          router.push({
            pathname: "/components/PlayerScreen/filter-update-screen",
            params: { filterId: item.id },
          })
        }
        style={[styles.filterItem, isEdit && { justifyContent: "flex-start" }]}
      >
        {isEdit && <RemoveButton onPress={() => removeFilter(item.id)} />}
        <Text style={styles.filterText}>{item.name}</Text>
        {isEdit || (
          <View style={styles.removeButton}>
            <AntDesign name="right" size={24} color={ColorPalette.normalIcon} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const removeFilter = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let newFilters: Filter[] = [];
    setFilters((prev) => {
      newFilters = prev.filter((filter) => filter.id !== id);
      return newFilters;
    });

    saveFilters(newFilters);
  };

  return (
    <>
      <CustomHeader
        title="フィルター一覧"
        isSlideScreen
        headerLeftText="プレイヤー"
        headerRight={() => {
          if (!isEdit) {
            return (
              <TouchableOpacity
                onPress={() => setIsEdit(true)}
                style={[globalStyles.headerRight, { marginRight: -8 }]}
              >
                <Text style={globalStyles.headerText}>編集</Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                onPress={() => setIsEdit(false)}
                style={[globalStyles.headerRight, { marginRight: -8 }]}
              >
                <Text style={globalStyles.headerText}>完了</Text>
              </TouchableOpacity>
            );
          }
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/components/PlayerScreen/filter-update-screen",
            })
          }
          style={{
            alignItems: "flex-end",
            ...globalStyles.touch,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: ColorPalette.link, fontSize: FONT_SIZE.body }}>
            フィルター作成
          </Text>
        </TouchableOpacity>
        <FlatList
          data={filters}
          renderItem={renderFilter}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ListEmptyText message="フィルターがありません" />
          }
          style={styles.list}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    flex: 1,
    ...globalStyles.touch,
  },
  filterText: {
    fontSize: FONT_SIZE.body,
  },
  row: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
});

export default FilterScreen;
