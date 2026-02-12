import { AppContext } from "@/context/AppContext";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import analytics from "@react-native-firebase/analytics";
import { useContext, useState } from "react";
import { Alert } from "react-native";

export const useRest = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<number[]>([]);
  const {
    players,
    setPlayers,
    courts,
    gameRounds,
    generateMode,
    pairs,
    genderSetting,
    isPreferMatchCountOverPair,
  } = useContext(AppContext);

  const selectPlayer = (id: number) => {
    setSelectedPlayer((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const createRestPlayer = async () => {
    if (selectedPlayer.length < 1) {
      return Alert.alert("1人以上選んでください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }

    const joinPlayerCount = players.filter((p) => p.isJoin).length;
    const playablePlayerCount = players.filter(
      (p) => p.isJoin && !p.isRest && !selectedPlayer.includes(p.id),
    ).length;
    const needPlayerCount = courts.length * 4;
    if (playablePlayerCount < needPlayerCount) {
      return Alert.alert(
        `休憩にできません`,
        `試合作成に必要な人数が足りなくなります\n休憩にしたい場合は、コート数を減らしてください\n休憩にできる人数: ${joinPlayerCount - needPlayerCount}人\n試合作成に必要な人数: ${needPlayerCount}人\n参加中人数: ${joinPlayerCount}人`,
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
      );
    }

    if (selectedPlayer.length < 1) {
      return Alert.alert("1人以上選んでください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
    }

    let newPlayers = players;
    setPlayers((prev) => {
      newPlayers = prev.map((player) => {
        if (selectedPlayer.includes(player.id)) {
          return { ...player, isRest: true };
        }
        return player;
      });
      return newPlayers;
    });
    setSelectedPlayer([]);

    await clearGameData();
    await saveGameData({
      gameRounds,
      courts,
      generateMode: generateMode,
      recentPlayers: newPlayers,
      anonymousPlayerCount: newPlayers.filter((p) => p.isAnonymous).length,
      pairs,
      genderSetting,
      isPreferMatchCountOverPair,
      saveAt: new Date().getTime(),
    });

    await analytics().logEvent("create_rest_player");
  };

  const removeRestPlayer = async (id: number) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === id) {
          return { ...player, isRest: false };
        }
        return player;
      }),
    );

    await analytics().logEvent("remove_rest_player");
  };

  return {
    selectedPlayer,
    selectPlayer,
    createRestPlayer,
    removeRestPlayer,
  };
};
