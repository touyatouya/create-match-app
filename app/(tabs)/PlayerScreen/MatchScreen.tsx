import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
// import analytics from "@react-native-firebase/analytics";
import { FontAwesome5, Foundation, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import AdCompleteSnackbar from "../../components/AdCompleteSnackbar";
import CustomHeader from "../../components/CustomHeader";
import Loading from "../../components/Loading";
import Match from "../../components/MatchScreen/match";
import MyAdmob, { BannerAdSize } from "../../components/MyAdmob";

const MatchScreen: React.FC = () => {
  const {
    setPlayers,
    gameRounds,
    setGameRounds,
    isLoading,
    genderSetting,
    // isProUser
  } = useContext(AppContext);

  const [swapPlayer, setSwapPlayer] = useState<number | null>(null);
  const [dispRound, setDispRound] = React.useState<number>(gameRounds.length);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    // analytics().logEvent("screen_view", {
    //   screen_name: "MatchScreen",
    // });
  }, []);

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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: "/PlayerScreen/PairSettingScreen" })
              }
              style={globalStyles.headerRight}
            >
              <FontAwesome5
                name="handshake"
                size={24}
                color={ColorPalette.blackText}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: "/PlayerScreen/GenderSettingScreen" })
              }
              style={globalStyles.headerRight}
            >
              <Foundation
                name="male-female"
                size={24}
                color={ColorPalette.blackText}
              />
            </TouchableOpacity>
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
              <MaterialIcons
                name="delete-forever"
                size={24}
                color={ColorPalette.blackText}
              />
            </TouchableOpacity>
          </View>
        )}
        isSlideScreen
        headerLeftText="試合準備"
        disalbed={isLoading}
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
      {/* {!isProUser && <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />} */}
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: ColorPalette.pageBackground,
    borderTopWidth: 0.5,
    borderTopColor: ColorPalette.pageHeaderFooterBorder,
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
