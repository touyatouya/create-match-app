import { isVersionNewer } from "@/utils/isVersionNewer";
import Constants from "expo-constants";
import { Redirect } from "expo-router";
import { getApp } from "firebase/app";
import { getRemoteConfig, getValue } from "firebase/remote-config";
import { useEffect } from "react";
import { Alert, Linking } from "react-native";

export default function Index() {
  useEffect(() => {
    // Firebase アプリインスタンス取得（_layout.tsx で initialize 済み）
    const app = getApp();

    // Remote Config インスタンス取得
    const remoteConfig = getRemoteConfig(app);

    // Remote Config からフラグ取得
    const latestVersion = getValue(remoteConfig, "latest_version").asString();
    const storeUrl = getValue(remoteConfig, "store_url").asString();

    const appVersion = Constants.expoConfig?.version || "1.5.0";
    const needsUpdate = isVersionNewer(latestVersion, appVersion);

    // アップデート必須の場合
    if (needsUpdate) {
      Alert.alert(
        "アップデートのお知らせ",
        `新しいバージョン（${latestVersion}）が公開されています。アプリを更新してください。`,
        [
          {
            text: "あとで",
            style: "cancel",
          },
          {
            text: "アップデートへ進む",
            onPress: () => Linking.openURL(storeUrl),
          },
        ],
        { cancelable: false }
      );
    }
  }, []);

  return <Redirect href="/PlayerScreen" />;
}
