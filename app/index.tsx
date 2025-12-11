import { isVersionNewer } from "@/utils/isVersionNewer";
import firestore from "@react-native-firebase/firestore";
import Constants from "expo-constants";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Alert, Linking } from "react-native";

export default function Index() {
  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const data = await firestore()
          .collection("app_config")
          .doc("version")
          .get()
          .then((doc) => doc.data());

        if (!data) return;

        const latest = data.latest_version;
        const url = data.store_url_ios;

        const current = Constants.expoConfig?.version; // アプリ側

        if (!latest || !current) return;

        if (isVersionNewer(latest, current)) {
          // 更新が必要
          Alert.alert(
            "アップデートがあります",
            "新しいバージョンが利用できます",
            [
              {
                text: "アップデート",
                onPress: () => {
                  Linking.openURL(url);
                },
              },
              { text: "閉じる", style: "cancel" },
            ]
          );
        }
      } catch (e) {
        console.log("version check error:", e);
      }
    };
    checkAppVersion();
  }, []);

  return <Redirect href="/PlayerScreen" />;
}
