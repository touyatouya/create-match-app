import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { generateUniqId } from "@/utils/createId";
import Feather from "@expo/vector-icons/Feather";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

const CourtScreen: React.FC = () => {
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
      <PrimaryButton
        text="コートを追加"
        icon={
          <Feather
            name="plus-circle"
            size={24}
            color={ColorPalette.whiteText}
          />
        }
        onPress={addCourt}
      />
      <PrimaryButton
        text="コートを削除"
        icon={
          <Feather
            name="minus-circle"
            size={24}
            color={ColorPalette.whiteText}
          />
        }
        onPress={removeCourt}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontSize: FONT_SIZE.title,
    fontWeight: 600,
    color: ColorPalette.sectionTitie,
  },
  count: {
    fontSize: FONT_SIZE.heading,
    color: ColorPalette.blackText,
  },
});

export default CourtScreen;
