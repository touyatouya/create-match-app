import { AppProvider } from "@/context/AppContext";
import firebaseConfig from "@/utils/firebaseConfig";
import { Stack } from "expo-router";
import { initializeApp } from "firebase/app";
import { fetchAndActivate, getRemoteConfig } from "firebase/remote-config";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  useEffect(() => {
    // Firebase 初期化（1回だけ）
    const app = initializeApp(firebaseConfig);

    // Remote Config 初期化
    const remoteConfig = getRemoteConfig(app);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: __DEV__ ? 0 : 3600000, // 開発中は即時反映、本番は1時間
      fetchTimeoutMillis: 60000,
    };

    // 初回 fetchAndActivate（起動時に取得して最新化）
    fetchAndActivate(remoteConfig)
      .then(() => {
        console.log("Remote Config fetched & activated");
      })
      .catch((err) => {
        console.log("Remote Config fetch error:", err);
      });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Stack />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
