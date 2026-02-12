import { AppContext } from "@/context/AppContext";
import { clearGameData } from "@/utils/saveStorage";
import analytics from "@react-native-firebase/analytics";
import { useContext } from "react";
import { Alert } from "react-native";
import { useResetSwap } from "./useResetSwap";

export const useResetGr = () => {
  const { setPlayers, setGameRounds, setDispRound } = useContext(AppContext);

  const { resetSwap } = useResetSwap();

  const resetGameRound = async () => {
    setGameRounds([]);
    setPlayers((prev) => {
      return prev.map((player) => {
        return {
          ...player,
          isRest: false,
          matchCount: 0,
        };
      });
    });
    resetSwap();
    setDispRound(0);

    clearGameData();

    await analytics().logEvent("reset_game");
  };

  const confirmReset = () => {
    Alert.alert("確認", "全ての組み合わせを削除しますがよろしいですか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "削除",
        onPress: resetGameRound,
        style: "destructive",
      },
    ]);
  };
  return { confirmReset };
};
