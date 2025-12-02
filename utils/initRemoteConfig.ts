import remoteConfig from "@react-native-firebase/remote-config";
import * as Application from "expo-application";
import { Alert, Linking, Platform } from "react-native";

export const initRemoteConfig = async () => {
  await remoteConfig().setDefaults({
    latest_version_ios: "1.5.0",
  });

  await remoteConfig().fetchAndActivate();
};

export const getCurrentVersion = () => {
  return Application.nativeApplicationVersion ?? "1.5.0";
};

export const isLatestVersion = () => {
  const latest = remoteConfig().getString("latest_version_ios");
  const current = getCurrentVersion();

  return compareVersions(current, latest) >= 0;
};

// バージョン比較ユーティリティ
const compareVersions = (v1: string, v2: string) => {
  const a = v1.split(".").map(Number);
  const b = v2.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) > (b[i] ?? 0)) return 1;
    if ((a[i] ?? 0) < (b[i] ?? 0)) return -1;
  }
  return 0;
};

export const showUpdateDialog = () => {
  Alert.alert(
    "アップデートのお知らせ",
    "最新バージョンが利用可能です。アップデートしてください。",
    [
      {
        text: "アップデート",
        onPress: () => {
          if (Platform.OS === "ios") {
            Linking.openURL(
              "https://apps.apple.com/jp/app/%E3%83%80%E3%83%96%E3%83%AB%E3%82%B9%E7%B5%84%E3%81%BF%E5%90%88%E3%82%8F%E3%81%9B%E7%94%9F%E6%88%90/id6748458935"
            );
          }
        },
      },
    ],
    { cancelable: false }
  );
};
