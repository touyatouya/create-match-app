import Colors from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { generateUniqId } from "@/utils/createId";
import Feather from "@expo/vector-icons/Feather";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CoatScreen: React.FC = () => {
  const { courts, setCourts } = useContext(AppContext);

  const addCourt = () => {
    setCourts((prev) => {
      const courtIds = prev.map((court) => court.id);
      const id = generateUniqId(courtIds);
      return [...prev, { id: id }];
    });
  };

  const removeCourt = () => {
    setCourts((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, index) => prev.length - 1 !== index);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>コート管理</Text>
        <Text style={styles.count}>{courts.length}コート</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={addCourt}>
        <Feather name="plus-circle" size={24} color={Colors.whiteText} />
        <Text style={styles.addButtonText}>コートを追加</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={removeCourt}>
        <Feather name="plus-circle" size={24} color={Colors.whiteText} />
        <Text style={styles.addButtonText}>コートを削除</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: Colors.sectionTitie,
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
  emptyText: {
    textAlign: "center",
    color: Colors.emptyText,
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  count: {
    fontSize: 16,
    color: Colors.blackText,
  },
  addButton: {
    // backgroundColor: Colors.accent,
    backgroundColor: Colors.primary,
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
    color: Colors.whiteText,
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default CoatScreen;
