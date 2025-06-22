import Colors from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { saveFilters } from "@/utils/saveStorage";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Filter } from "../../../types";

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
            pathname: "/components/PlayerScreen/filter-edit-screen",
            params: { filterId: item.id },
          })
        }
        style={[styles.filterItem, isEdit && { justifyContent: "flex-start" }]}
      >
        {isEdit && (
          <TouchableOpacity
            onPress={() => removeFilter(item.id)}
            style={styles.removeButton}
          >
            <AntDesign name="minuscircle" size={24} color="red" />
          </TouchableOpacity>
        )}
        <Text style={styles.filterText}>{item.name}</Text>
        {isEdit || (
          <View style={styles.removeButton}>
            <AntDesign name="right" size={24} color={Colors.normalIcon} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const removeFilter = (id: number) => {
    let newFilters: Filter[] = [];
    setFilters((prev) => {
      newFilters = prev.filter((filter) => filter.id !== id);
      return newFilters;
    });

    saveFilters(newFilters);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "フィルター一覧",
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
                プレイヤー
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => {
            if (!isEdit) {
              return (
                <TouchableOpacity
                  onPress={() => setIsEdit(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: 16,
                      color: Colors.link,
                    }}
                  >
                    編集
                  </Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => setIsEdit(false)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 6,
                      fontSize: 16,
                      color: Colors.link,
                    }}
                  >
                    完了
                  </Text>
                </TouchableOpacity>
              );
            }
          },
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/components/PlayerScreen/filter-create-screen",
            })
          }
          style={{ alignItems: "flex-end" }}
        >
          <Text style={{ color: Colors.link, fontSize: 16 }}>
            フィルター作成
          </Text>
        </TouchableOpacity>
        <SwipeListView
          data={filters}
          renderItem={renderFilter}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>フィルターがありません。</Text>
          }
          renderHiddenItem={({ item }) => (
            <View style={styles.rowBack}>
              <Pressable onPress={() => removeFilter(item.id)}>
                <Text style={styles.deleteText}>削除</Text>
              </Pressable>
            </View>
          )}
          rightOpenValue={-65}
          disableRightSwipe
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
    flex: 1,
  },
  deleteText: {
    color: Colors.whiteText,
    fontWeight: "bold",
    textAlign: "center",
  },
  filterText: {
    fontSize: 16,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: 20,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.transparent,
    zIndex: 9999,
  },
  centerToast: {
    backgroundColor: Colors.background,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toastText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.sectionTitie,
  },
  pairName: {
    justifyContent: "flex-start",
    fontSize: 16,
    fontWeight: "500",
  },
  pairInfo: {
    flexDirection: "row",
    flex: 2,
    fontSize: 20,
    fontWeight: "500",
    justifyContent: "flex-start",
    alignItems: "baseline",
  },
  pairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 12,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.sectionTitie,
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  addButtonText: {
    color: Colors.whiteText,
    marginLeft: 8,
    fontWeight: "600",
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  row: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderline,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
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
    color: Colors.sectionTitie,
  },
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
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
  list: {
    flex: 1,
  },
  joinPlayerItem: {
    flexDirection: "row",
    backgroundColor: Colors.cardBackGround,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  restPlayerItem: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.cardShadow,
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
  restingText: {
    color: Colors.restPlayerName,
    fontSize: 20,
    fontWeight: "bold",
  },
  matchCountBadge: {
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  joinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  allJoinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  matchCountText: {
    color: Colors.whiteText,
    fontSize: 14,
    fontWeight: "bold",
  },
  restText: {
    color: Colors.blackText,
    fontSize: 18,
    fontWeight: "bold",
  },
  joinText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
    // display: "flex",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.emptyText,
    marginTop: 20,
  },
  joinedPlayer: {
    marginBottom: 6,
  },
});

export default FilterScreen;
