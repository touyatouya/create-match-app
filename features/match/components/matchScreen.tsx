import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { GenerateMode } from "@/types";
import Loading from "@/ui/Loading";
import MyAdmob, { BannerAdSize } from "@/ui/MyAdmob";
import { saveOpenApp } from "@/utils/storeReview";
import analytics from "@react-native-firebase/analytics";
import React, { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import CreateNewMatchButton from "./createNewMatchButton";
import FillEmptyMatchHeader from "./fillEmptyMatchHeader";
import MatchScreenHeader from "./matchScreenHeader";
import Matchup from "./matchup";
import ReplaceAllMatchHeader from "./replaceAllMatchHeader";

const MatchScreen: React.FC = () => {
  const { gameRounds, isLoading, setDispRound, generateMode, setIsLoading } =
    useContext(AppContext);

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "MatchScreen",
    });
    saveOpenApp();
    setDispRound(gameRounds.length >= 0 ? gameRounds.length : 0);
  }, [gameRounds.length, setDispRound]);

  useEffect(() => {
    setIsLoading(false);
  }, [gameRounds, setIsLoading]);

  return (
    <>
      {isLoading && <Loading />}
      <MatchScreenHeader />
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {generateMode === GenerateMode.REPLACE_ALL && (
            <CreateNewMatchButton />
          )}
          <FillEmptyMatchHeader />
          <ReplaceAllMatchHeader />
          <Matchup />
          {generateMode === GenerateMode.FILL_EMPTY && <CreateNewMatchButton />}
        </View>
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
