import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { countMatch } from "@/features/match/logic/utils";
import { globalStyles } from "@/styles/global";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GameRound, GenerateMode } from "../../../types";
import { useResetSwap } from "../hooks/useResetSwap";

const ReplaceAllMatchHeader: React.FC = () => {
  const {
    players,
    setPlayers,
    gameRounds,
    setGameRounds,
    generateMode,
    pairs,
    courts,
    isPreferMatchCountOverPair,
    genderSetting,
    dispRound,
    setDispRound,
  } = useContext(AppContext);

  const { resetSwap } = useResetSwap();

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
          onPress={async () => {
            setDispRound((prev) => prev - 1);

            await analytics().logEvent("prev_gameRound");
          }}
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
                let newGameRounds: GameRound[] = [];
                setGameRounds((prev) => {
                  newGameRounds = prev.slice(0, -1);
                  if (newGameRounds.length > 0) {
                    newGameRounds[newGameRounds.length - 1] = {
                      ...newGameRounds[newGameRounds.length - 1],
                      matches: newGameRounds[
                        newGameRounds.length - 1
                      ].matches.map((m) => ({
                        ...m,
                        isFinished: false,
                        canInsertNext: false,
                      })),
                    };
                  }
                  return newGameRounds;
                });
                const newMatch = newGameRounds.flatMap(
                  (gameRound) => gameRound.matches,
                );
                const newPlayers = countMatch(newMatch, players, setPlayers);
                resetSwap();
                setDispRound((prev) => prev - 1);

                await clearGameData();
                await saveGameData({
                  gameRounds: newGameRounds,
                  courts,
                  generateMode: generateMode,
                  recentPlayers: newPlayers,
                  anonymousPlayerCount: newPlayers.filter((p) => p.isAnonymous)
                    .length,
                  pairs,
                  genderSetting,
                  isPreferMatchCountOverPair,
                  saveAt: new Date().getTime(),
                });

                await analytics().logEvent("delete_game");
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
          onPress={async () => {
            setDispRound((prev) => prev + 1);

            await analytics().logEvent("next_gameRound");
          }}
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
