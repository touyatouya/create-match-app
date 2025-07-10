import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { generateUniqId } from "@/utils/createId";
import Feather from "@expo/vector-icons/Feather";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BannerAdSize } from "react-native-google-mobile-ads";
import MyAdmob from "../components/MyAdmob";

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
    <View style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>コート管理</Text>
        </View>
        <View style={styles.courtBlock}>
          <TouchableOpacity style={styles.button} onPress={removeCourt}>
            <Feather
              name="minus-circle"
              size={24}
              color={ColorPalette.primary}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{courts.length}コート</Text>
          <TouchableOpacity style={styles.button} onPress={addCourt}>
            <Feather
              name="plus-circle"
              size={24}
              color={ColorPalette.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "space-between" },
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
    justifyContent: "center",
    alignItems: "center",
    fontSize: FONT_SIZE.heading,
    color: ColorPalette.blackText,
  },
  courtBlock: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    ...globalStyles.touch,
  },
});

export default CourtScreen;
