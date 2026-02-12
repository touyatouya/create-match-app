import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import Match from "@/features/match/components/match";
import Loading from "@/ui/Loading";
import MyAdmob, { BannerAdSize } from "@/ui/MyAdmob";
import { saveOpenApp } from "@/utils/storeReview";
import analytics from "@react-native-firebase/analytics";
import React, { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MatchScreenHeader from "./matchScreenHeader";

const MatchScreen: React.FC = () => {
  const { gameRounds, isLoading, setDispRound } = useContext(AppContext);

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "MatchScreen",
    });
    saveOpenApp();
    setDispRound(gameRounds.length >= 0 ? gameRounds.length : 0);
  }, [gameRounds.length, setDispRound]);

  return (
    <>
      {isLoading && <Loading />}
      <MatchScreenHeader />
      <View style={styles.container}>
        <Match />
      </View>
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
});

export default MatchScreen;
