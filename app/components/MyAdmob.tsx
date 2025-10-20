import React from "react";
import { View } from "react-native";

let BannerAd: any;
let BannerAdSize: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const admob = require("react-native-google-mobile-ads");

  if (admob && admob.BannerAd && admob.BannerAdSize) {
    BannerAd = admob.BannerAd;
    BannerAdSize = admob.BannerAdSize;
  } else {
    throw new Error("AdMob module is not properly linked");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (e) {
  console.warn(
    "⚠️ AdMob module not found (likely running in Expo Go). Using mock."
  );

  // Expo Go で参照されても安全な mock 定義
  BannerAdSize = {
    BANNER: "mock",
    LARGE_BANNER: "mock",
    MEDIUM_RECTANGLE: "mock",
    FULL_BANNER: "mock",
    LEADERBOARD: "mock",
    SMART_BANNER: "mock",
    ANCHORED_ADAPTIVE_BANNER: "mock",
  };
}

// ✅ export して使用側で import できるようにする
export { BannerAdSize };

interface Props {
  size?: keyof typeof BannerAdSize | string;
}

export default function MyAdmob({ size = BannerAdSize.BANNER }: Props) {
  const unitId = "ca-app-pub-1546884469851348/1540733171";

  if (!BannerAd) {
    return (
      <View
        style={{
          height: 0,
          backgroundColor: "#eee",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <View style={{ marginBottom: 8 }}>
      <BannerAd unitId={unitId} size={size} />
    </View>
  );
}
