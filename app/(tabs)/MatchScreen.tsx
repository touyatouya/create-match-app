import Match from "@/app/components/MatchScreen/match";
import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { BannerAdSize } from "react-native-google-mobile-ads";
import { GenderPreferenceSetting } from "../../types";
import AdCompleteSnackbar from "../components/AdCompleteSnackbar";
import CustomHeader from "../components/CustomHeader";
import Disclosure from "../components/Disclosure";
import GenderSetting from "../components/MatchScreen/genderSetting";
import PairSetting from "../components/MatchScreen/pairSetting";
import RestSetting from "../components/MatchScreen/restSetting";
// import PurchaseModal from "../components/PurchaseModal";

const MatchScreen: React.FC = () => {
  const { setPlayers, setGameRounds, isProUser } = useContext(AppContext);

  const [genderSetting, setGenderSetting] = useState<GenderPreferenceSetting>({
    men: false,
    woman: false,
    mix: false,
  });

  const [expanded, setExpanded] = useState(false);
  const [swapPlayer, setSwapPlayer] = useState<number | null>(null);
  const [dispRound, setDispRound] = React.useState<number>(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [isOpenPurchaseModal, setIsOpenPurchaseModal] = useState(false);

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
        headerLeft={() => (
          <TouchableOpacity
            onPress={() => setIsOpenPurchaseModal(true)}
            style={globalStyles.headerLeft}
          >
            <FontAwesome
              name="diamond"
              size={24}
              color={ColorPalette.normalIcon}
            />
          </TouchableOpacity>
        )}
      />
      {/* <PurchaseModal
        isOpen={isOpenPurchaseModal}
        onClose={() => setIsOpenPurchaseModal(false)}
      /> */}
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
              <RestSetting />
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
