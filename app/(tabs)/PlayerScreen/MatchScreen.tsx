import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { clearGameData } from "@/utils/saveStorage";
import { saveOpenApp } from "@/utils/storeReview";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import { router } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import AdCompleteSnackbar from "../../components/AdCompleteSnackbar";
import CustomHeader from "../../components/CustomHeader";
import Loading from "../../components/Loading";
import Match from "../../components/MatchScreen/match";
import MyAdmob, { BannerAdSize } from "../../components/MyAdmob";

const MatchScreen: React.FC = () => {
  const { setPlayers, gameRounds, setGameRounds, isLoading, genderSetting } =
    useContext(AppContext);

  const [swapPlayer, setSwapPlayer] = useState<number | null>(null);
  const [dispRound, setDispRound] = React.useState<number>(gameRounds.length);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "MatchScreen",
    });
    saveOpenApp();
  }, []);

  const resetGameRound = useCallback(async () => {
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

    clearGameData();

    await analytics().logEvent("reset_game");
  }, [setGameRounds, setPlayers]);

  return (
    <>
      {isLoading && <Loading />}
      <CustomHeader
        title="試合"
        headerRight={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (isLoading) return;
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
                  ],
                );
              }}
              style={globalStyles.headerRight}
            >
              <MaterialCommunityIcons
                name="delete-alert-outline"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (isLoading) return;
                router.push({ pathname: "/PlayerScreen/MatchMenuScreen" });
              }}
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
      <View style={styles.container}>
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
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: ColorPalette.pageBackground,
    borderTopWidth: 0.5,
    borderTopColor: ColorPalette.pageHeaderFooterBorder,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: ColorPalette.whiteIcon,
    borderRadius: 8,
  },
  detailSetting: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ColorPalette.borderline,
    marginBottom: 4,
  },
});

export default MatchScreen;
