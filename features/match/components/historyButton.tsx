import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const HistoryButton: React.FC = () => {
  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/Player/History" })}
    >
      <AntDesign name="history" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default HistoryButton;
