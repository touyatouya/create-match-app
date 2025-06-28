import { AppContext } from "@/context/AppContext";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CustomHeader from "../CustomHeader";
import ListEmptyText from "../ListEmptyText";
import NavigateLink from "../NavigateLink";
import FilterList from "./filterList";
import HeaderRight from "./headerRight";

const FilterScreen: React.FC = () => {
  const { filters } = useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);

  const router = useRouter();

  return (
    <>
      <CustomHeader
        title="フィルター一覧"
        isSlideScreen
        headerLeftText="プレイヤー"
        headerRight={() => {
          if (!isEdit) {
            return <HeaderRight text="編集" onPress={() => setIsEdit(true)} />;
          } else {
            return <HeaderRight text="完了" onPress={() => setIsEdit(false)} />;
          }
        }}
      />
      <View style={styles.container}>
        <NavigateLink
          onPress={() =>
            router.push({
              pathname: "/components/PlayerScreen/filter-update-screen",
            })
          }
          text="フィルター作成"
        />
        <FlatList
          data={filters}
          renderItem={({ item }) => <FilterList item={item} isEdit={isEdit} />}
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
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    flex: 1,
  },
});

export default FilterScreen;
