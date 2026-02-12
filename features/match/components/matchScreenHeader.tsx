import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import CustomHeader from "@/ui/CustomHeader";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useResetGr } from "../hooks/useResetGr";

const MatchScreenHeader: React.FC = () => {
  const { isLoading } = useContext(AppContext);

  const { confirmReset } = useResetGr();

  return (
    <CustomHeader
      title="試合"
      headerRight={() => (
        <View style={styles.right}>
          <TouchableOpacity
            onPress={confirmReset}
            style={globalStyles.headerRight}
          >
            <MaterialCommunityIcons
              name="delete-alert-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/Player/MatchMenu" })}
            style={globalStyles.headerRight}
          >
            <AntDesign name="menu" size={20} color="black" />
          </TouchableOpacity>
        </View>
      )}
      isSlideScreen
      headerLeftText="試合準備"
      disabled={isLoading}
    />
  );
};

const styles = StyleSheet.create({
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 32,
  },
});

export default MatchScreenHeader;
