import { AppContext } from "@/context/AppContext";
import { Court, Rank } from "@/types";
import { generateUniqId } from "@/utils/createId";
import Feather from "@expo/vector-icons/Feather";
import React, { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CoatScreen: React.FC = () => {
  const { courts, setCourts } = useContext(AppContext);

  const addCourt = () => {
    setCourts((prev) => {
      const courtIds = prev.map((court) => court.id);
      const id = generateUniqId(courtIds);
      return [...prev, { id: id, rank: Rank.未設定 }];
    });
  };

  const removeCourt = (id: number) => {
    setCourts((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((court) => court.id !== id);
    });
  };

  const rankOrder: Rank[] = [Rank.A, Rank.B, Rank.C, Rank.未設定];

  const getNextRank = (current: Rank): Rank => {
    const index = rankOrder.indexOf(current);
    return rankOrder[(index + 1) % rankOrder.length];
  };

  const updateCourtRank = (courtId: number) => {
    setCourts((prev) =>
      prev.map((court) =>
        court.id === courtId
          ? { ...court, rank: getNextRank(court.rank) }
          : court
      )
    );
  };

  const renderItem = ({ item, index }: { item: Court; index: number }) => (
    <View style={styles.courtItem}>
      <Text style={styles.courtTitle}>{index + 1}コート</Text>
      <View style={styles.courtInfo}>
        <View style={styles.rankToggle}>
          <TouchableOpacity onPress={() => updateCourtRank(item.id)}>
            <Text style={styles.rankText}>レベル: {item.rank}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.trashIcon}
          onPress={() => removeCourt(item.id)}
        >
          <Feather name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>コート管理</Text>
        <Text style={styles.count}>{courts.length}コート</Text>
      </View>
      <FlatList
        data={courts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            プレイヤーがいません。追加してください。
          </Text>
        }
        style={styles.list}
      />
      <TouchableOpacity style={styles.addButton} onPress={addCourt}>
        <Feather name="plus-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>コートを追加</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    flex: 1,
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
  courtItem: {
    flexDirection: "column", // View 用
    marginBottom: 12,
  },
  courtTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  courtInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rankToggle: {
    borderRadius: 8,
    backgroundColor: "#e6dcdc",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#f0f0f0",
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  count: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  trashIcon: {
    padding: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "red",
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default CoatScreen;
