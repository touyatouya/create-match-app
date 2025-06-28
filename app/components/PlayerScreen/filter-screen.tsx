import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomHeader from "../CustomHeader";
import ListEmptyText from "../ListEmptyText";
import NavigateLink from "../NavigateLink";
import FilterList from "./filterList";

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
