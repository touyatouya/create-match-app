import { AppContext } from "@/context/AppContext";
import Feather from "@expo/vector-icons/Feather";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CoatScreen: React.FC = () => {
  const { coatCount, setCoatCount } = useContext(AppContext);

  const addCourt = () => {
    setCoatCount((prev) => prev + 1);
  };

  const removeCourt = () => {
    if (coatCount === 1) return;
    setCoatCount((prev) => prev - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>コート管理</Text>
        <Text style={styles.count}>{coatCount}コート</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addCourt}>
        <Feather name="plus-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>コートを追加</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={removeCourt}>
        <Feather name="minus-circle" size={24} color="white" />
        <Text style={styles.addButtonText}>コートを削除</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
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
  addButton: {
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default CoatScreen;
