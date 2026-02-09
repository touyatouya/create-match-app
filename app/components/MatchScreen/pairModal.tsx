import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Pair, Player } from "@/types";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import PairItem from "../PairItem";
import PlayerItem from "../PlayerItem";
import PrimaryButton from "../PrimaryButton";
import SectionFooter from "./sectionFooter";

type SectionDataItem = Pair | Player;

type Section = {
  title: string;
  type: "pairs" | "players";
  data: SectionDataItem[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PairModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    players,
    pairs,
    setPairs,
    gameRounds,
    courts,
    generateMode,
    genderSetting,
    isPreferMatchCountOverPair,
  } = useContext(AppContext);
  const [pair, setPair] = useState<number[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "PairModal",
    });
  }, []);

  const selectPlayer = (id: number) =>
    setPair((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length === 2
          ? [prev[0], id]
          : [...prev, id],
    );

  const createPair = async () => {
    let newPairs: Pair[] = [];

    if (pair.length !== 2)
      return Alert.alert("2人選んでください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);

    setPairs((prev) => {
      const pairIds = prev.map((pair) => pair.id);
      let newPairId: number;
      do {
        newPairId = Math.floor(Math.random() * 10000); // 1〜10000の自然数
      } while (pairIds.includes(newPairId));

      const newPair: Pair = {
        id: newPairId,
        player1: pair[0],
        player2: pair[1],
      };
      newPairs = [...prev, newPair];
      return newPairs;
    });
    setPair([]);

    await clearGameData();
    await saveGameData({
      gameRounds,
      courts,
      generateMode: generateMode,
      recentPlayers: players,
      anonymousPlayerCount: players.filter((p) => p.isAnonymous).length,
      pairs: newPairs,
      genderSetting,
      isPreferMatchCountOverPair,
      saveAt: new Date().getTime(),
    });

    await analytics().logEvent("create_pair");
  };

  const removePair = async (id: number) => {
    setPairs((prev) => prev.filter((pair) => pair.id !== id));

    await analytics().logEvent("remove_pair");
  };

  const NotPaierPlayer = players.filter(
    (player) =>
      player.isJoin &&
      !pairs.find(
        (pair) => pair.player1 === player.id || pair.player2 === player.id,
      ),
  );

  const sections: Section[] = [
    {
      title: "ペア一覧",
      data: pairs,
      type: "pairs",
    },
    {
      title: "ペア未設定プレイヤー",
      data: NotPaierPlayer,
      type: "players",
    },
  ];

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false}>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: 20,
          backgroundColor: ColorPalette.pageBackground,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
            style={styles.headerButton}
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.modalTitleWrapper}>
            <Text style={styles.title}>ペア作成</Text>
          </View>
        </View>
        <View style={styles.container}>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.id.toString() + index}
            renderItem={({ item, section }) =>
              section.type === "pairs" ? (
                <PairItem
                  item={item as Pair}
                  onPressRemoveButton={() => removePair(item.id)}
                />
              ) : (
                <PlayerItem
                  item={item as Player}
                  onPress={() => selectPlayer(item.id)}
                  isSelected={pair.some((p) => item.id === p)}
                  selectedText="選択中"
                />
              )
            }
            renderSectionHeader={({ section }) =>
              section.type === "pairs" ? (
                <View style={styles.pairHeader}>
                  <View style={styles.restingTitle}>
                    <MaterialCommunityIcons
                      name="human-male-male"
                      size={24}
                      color={ColorPalette.normalIcon}
                    />
                    <Text style={styles.restingSectionTitle}>
                      {section.title}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.playerHeader}>
                  <View style={styles.restingTitle}>
                    <MaterialCommunityIcons
                      name="human-male"
                      size={24}
                      color={ColorPalette.normalIcon}
                    />
                    <Text style={styles.restingSectionTitle}>
                      {section.title}
                    </Text>
                  </View>
                </View>
              )
            }
            renderSectionFooter={({ section }) =>
              section.type === "pairs" ? (
                <SectionFooter
                  message="ペアはありません"
                  visible={section.data.length === 0}
                />
              ) : (
                <SectionFooter
                  message="参加中でペア未設定のプレイヤーはいません"
                  visible={section.data.length === 0}
                />
              )
            }
          />
          <PrimaryButton onPress={createPair} text="ペア作成" />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalTitleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    ...globalStyles.touch,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
  },
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
  },
});

export default PairModal;
