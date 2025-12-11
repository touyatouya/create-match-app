import AdCompleteSnackbar from "@/app/components/AdCompleteSnackbar";
import CustomHeader from "@/app/components/CustomHeader";
import Loading from "@/app/components/Loading";
import SectionFooter from "@/app/components/MatchScreen/sectionFooter";
import MyAdmob, { BannerAdSize } from "@/app/components/MyAdmob";
import PairItem from "@/app/components/PairItem";
import PlayerItem from "@/app/components/PlayerItem";
import PrimaryButton from "@/app/components/PrimaryButton";
import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { Alert, SectionList, StyleSheet, Text, View } from "react-native";
import { Pair, Player } from "../../../types";

type SectionDataItem = Pair | Player;

type Section = {
  title: string;
  type: "pairs" | "players";
  data: SectionDataItem[];
};

const PairSettingScreen: React.FC = () => {
  const {
    players,
    pairs,
    setPairs,
    // isPairUnlocked,
    // setIsPairUnlocked,
    isLoading,
    // isProUser,
  } = useContext(AppContext);
  const [pair, setPair] = useState<number[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const selectPlayer = (id: number) =>
    setPair((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length === 2
        ? [prev[0], id]
        : [...prev, id]
    );

  const createPair = () => {
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
  };

  const removePair = (id: number) =>
    setPairs((prev) => prev.filter((pair) => pair.id !== id));

  const NotPaierPlayer = players.filter(
    (player) =>
      player.isJoin &&
      !pairs.find(
        (pair) => pair.player1 === player.id || pair.player2 === player.id
      )
  );

  const sections: Section[] = [
    {
      title: "",
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
    <>
      <CustomHeader
        title="ペア設定"
        isSlideScreen
        headerLeftText="プレイヤー"
      />
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
                  <Text style={styles.restingSectionTitle}>ペア一覧</Text>
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
                    ペア未設定プレイヤー
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
        <AdCompleteSnackbar
          visiable={snackbarVisible}
          message={`ペア数の制限が解除されました！`}
          onDismiss={() => setSnackbarVisible(false)}
          onPressLabel={() => setSnackbarVisible(false)}
        />
        <PrimaryButton onPress={createPair} text="ペア作成" />
        {/* {isProUser || pairs.length < 3 || isPairUnlocked ? ( */}
        {/* {pairs.length < 3 || isPairUnlocked ? (
          <PrimaryButton onPress={createPair} text="ペア作成" />
        ) : (
          <RewardAdButton
            onPress={() => setIsPairUnlocked(true)}
            text="動画を見て更にペアを作る"
            setSnackbarVisible={setSnackbarVisible}
          />
        )} */}
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      {isLoading && <Loading />}
    </>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: ColorPalette.whiteText,
    fontSize: FONT_SIZE.body,
    fontWeight: "bold",
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
    color: ColorPalette.sectionTitie,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: ColorPalette.sectionTitie,
  },
});

export default PairSettingScreen;
