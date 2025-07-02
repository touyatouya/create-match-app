import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

interface PrimaryRewardAdButtonProps {
  onPress?: () => void;
  text: string;
  setSnackbarVisible: (value: React.SetStateAction<boolean>) => void;
}

const RewardAdButton: React.FC<PrimaryRewardAdButtonProps> = ({
  onPress,
  text,
  setSnackbarVisible,
}) => {
  const {
    players,
    setPlayers,
    gameRounds,
    setGameRounds,
    pairs,
    courts,
    setIsLoading,
  } = useContext(AppContext);

  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const adInstance = RewardedAd.createForAdRequest(adUnitId, {
      keywords: ["fashion", "clothing"],
    });
    setRewarded(adInstance);

    const unsubscribeLoaded = adInstance.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );
    const unsubscribeEarned = adInstance.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        setSnackbarVisible(true);
      }
    );

    adInstance.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [setSnackbarVisible]);

  const handlePress = () => {
    if (loaded && rewarded) {
      setIsLoading(true);
      setLoaded(false); // 次回のために初期化
      // 新しい広告をロード
      const newAd = RewardedAd.createForAdRequest(adUnitId, {
        keywords: ["fashion", "clothing"],
      });

      newAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setIsLoading(false);
        setLoaded(true);
        newAd.show();
      });

      newAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        setSnackbarVisible(true);
      });

      newAd.load();

      setRewarded(newAd);

      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !loaded && { backgroundColor: "#aaa" }, // ロード前はグレーなど
      ]}
      onPress={() => {
        if (loaded) {
          handlePress();
          onPress && onPress();
        }
      }}
      disabled={!loaded}
    >
      <Text style={styles.buttonText}>
        {loaded ? text : "動画を読み込み中..."}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorPalette.successBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 8,
    ...globalStyles.touch,
  },
  buttonText: {
    color: ColorPalette.whiteText,
    marginLeft: 8,
    fontWeight: 600,
    fontSize: FONT_SIZE.body,
  },
});

export default RewardAdButton;
