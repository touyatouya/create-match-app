import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GenerateMode } from "../../../types";
import { useDeleteGr } from "../hooks/useDeleteGr";
import { useMoveDispRound } from "../hooks/useMoveDispRound";

const ReplaceAllMatchHeader: React.FC = () => {
  const { gameRounds, generateMode, dispRound } = useContext(AppContext);

  const { deleteLastGr } = useDeleteGr();
  const { moveDispRound } = useMoveDispRound();

  if (generateMode !== GenerateMode.REPLACE_ALL) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {gameRounds[dispRound - 2] != null ? (
        <TouchableOpacity
          style={{
            ...globalStyles.touch,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => moveDispRound("prev")}
        >
          <AntDesign name="left" size={20} color={ColorPalette.normalIcon} />
        </TouchableOpacity>
      ) : (
        <View style={{ ...globalStyles.touch }}></View>
      )}
      {dispRound > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {gameRounds[dispRound] == null && (
            <View style={{ ...globalStyles.touch }}></View>
          )}
          <Text
            style={{
              fontSize: FONT_SIZE.subheading,
              marginHorizontal: 8,
            }}
          >
            {dispRound}巡目
          </Text>
          {gameRounds[dispRound] == null && (
            <TouchableOpacity
              style={{
                ...globalStyles.touch,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={async () => {
                await deleteLastGr();
              }}
            >
              <MaterialIcons name="delete-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      )}
      {gameRounds[dispRound] != null ? (
        <TouchableOpacity
          style={{
            ...globalStyles.touch,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => moveDispRound("next")}
        >
          <AntDesign name="right" size={20} color={ColorPalette.normalIcon} />
        </TouchableOpacity>
      ) : (
        <View style={{ ...globalStyles.touch }}></View>
      )}
    </View>
  );
};

export default ReplaceAllMatchHeader;
