import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import React, { useCallback, useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GenderPreferenceSetting } from "../types";
import AdCompleteSnackbar from "./components/AdCompleteSnackbar";
import CustomHeader from "./components/CustomHeader";
import Disclosure from "./components/Disclosure";
import Loading from "./components/Loading";
import GenderSetting from "./components/MatchScreen/genderSetting";
import Match from "./components/MatchScreen/match";
import PairSetting from "./components/MatchScreen/pairSetting";
import MyAdmob, { BannerAdSize } from "./components/MyAdmob";

const MatchScreen: React.FC = () => {
  const {
    setPlayers,
    gameRounds,
    setGameRounds,
    isLoading,
    // isProUser
  } = useContext(AppContext);

  const [genderSetting, setGenderSetting] = useState<GenderPreferenceSetting>({
    men: false,
    woman: false,
    mix: false,
  });

  const [expanded, setExpanded] = useState(false);
  const [swapPlayer, setSwapPlayer] = useState<number | null>(null);
  const [dispRound, setDispRound] = React.useState<number>(gameRounds.length);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const resetGameRound = useCallback(() => {
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
    setSwapPlayer(null);
    setDispRound(0);
  }, [setGameRounds, setPlayers]);

  return (
    <>
      {isLoading && <Loading />}
      <CustomHeader
        title="試合"
        headerRight={() => (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "確認",
                "全ての組み合わせを削除しますがよろしいですか？",
                [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "削除",
                    onPress: resetGameRound,
                    style: "destructive",
                  },
                ]
              );
            }}
            style={globalStyles.headerRight}
          >
            <Text style={globalStyles.headerText}>リセット</Text>
          </TouchableOpacity>
        )}
        isSlideScreen
        headerLeftText="試合準備"
        disalbed={isLoading}
      />
      <View style={styles.container}>
        <View style={styles.detailSetting}>
          <Disclosure
            isOpen={expanded}
            setIsOpen={setExpanded}
            label="詳細設定"
          />
          {expanded && (
            <>
              <GenderSetting
                genderSetting={genderSetting}
                setGenderSetting={setGenderSetting}
              />
              {/* <RestSetting /> */}
              <PairSetting />
            </>
          )}
        </View>
        <Match
          swapPlayer={swapPlayer}
          setSwapPlayer={setSwapPlayer}
          genderSetting={genderSetting}
          dispRound={dispRound}
          setDispRound={setDispRound}
          setSnackbarVisible={setSnackbarVisible}
        />
      </View>
      <AdCompleteSnackbar
        visiable={snackbarVisible}
        message={`あと5回試合作成できるようになりました！`}
        onDismiss={() => setSnackbarVisible(false)}
        onPressLabel={() => setSnackbarVisible(false)}
      />
      {/* {!isProUser && <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />} */}
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  detailSetting: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ColorPalette.borderline,
    marginBottom: 4,
  },
});

export default MatchScreen;
