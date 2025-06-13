import { AppContext } from "@/context/AppContext";
import { saveGroups } from "@/utils/saveStorage";
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
import { Group } from "../../../types";

const GroupScreen: React.FC = () => {
  const { groups, setGroups } = useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);

  const router = useRouter();

  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      onPress={() =>
        isEdit ||
        router.push({
          pathname: "/components/PlayerScreen/gruop-edit-screen",
          params: { gropuId: item.id },
        })
      }
      style={[styles.row, isEdit && { justifyContent: "flex-start" }]}
    >
      {isEdit && (
        <TouchableOpacity
          onPress={() => removeGroup(item.id)}
          style={styles.removeButton}
        >
          <AntDesign name="minuscircle" size={24} color="red" />
        </TouchableOpacity>
      )}
      <Text style={styles.groupText}>{item.name}</Text>
      {isEdit || (
        <View style={styles.removeButton}>
          <AntDesign name="right" size={24} color="black" />
        </View>
      )}
    </TouchableOpacity>
  );

  const removeGroup = (id: number) => {
    let newGroups: Group[] = [];
    setGroups((prev) => {
      newGroups = prev.filter((group) => group.id !== id);
      return newGroups;
    });

    saveGroups(newGroups);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "グループ一覧",
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
                      color: "rgb(0, 122, 255)",
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
                      color: "rgb(0, 122, 255)",
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
              pathname: "/components/PlayerScreen/gruop-create-screen",
            })
          }
          style={{ alignItems: "flex-end" }}
        >
          <Text style={{ color: "rgb(0, 122, 255)", fontSize: 16 }}>
            グループ作成
          </Text>
        </TouchableOpacity>
        <SwipeListView
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>グループがありません。</Text>
          }
          renderHiddenItem={({ item }) => (
            <View style={styles.rowBack}>
              <Pressable onPress={() => removeGroup(item.id)}>
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
  deleteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  groupText: {
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
    backgroundColor: "rgba(0,0,0,0.2)", // 半透明背景（不要なら削除OK）
    zIndex: 9999,
  },
  centerToast: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toastText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    color: "#333",
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  pairItem: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FFE8B2",
    flex: 1,
  },
  pairPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: "#664500",
    marginRight: 5,
  },
  allPlayerButton: {
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  row: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
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
    color: "#333",
  },
  count: {
    fontSize: 16,
    color: "#666",
  },
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
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
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  joinPlayerItem: {
    flexDirection: "row",
    backgroundColor: "hsl(50.96234309623431, 100%, 53.13725490196079%)",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  restPlayerItem: {
    flexDirection: "row",
    backgroundColor: "white",
    // backgroundColor: "#ccc4c4",
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
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
  restingBadge: {
    backgroundColor: "#FFD166",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  restingText: {
    color: "#664500",
    fontSize: 20,
    fontWeight: "bold",
  },
  matchCountBadge: {
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  joinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  allJoinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  restBadge: {
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  matchCountText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  restText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  joinText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
    display: "flex",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  joinedPlayer: {
    marginBottom: 6,
  },
});

export default GroupScreen;
