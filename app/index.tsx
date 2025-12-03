import { checkForUpdate } from "@/utils/checkUpdate";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";

export default function Index() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const run = async () => {
      const result = await checkForUpdate();

      if (result?.updateAvailable) {
        Alert.alert("アップデートのお知らせ", result.message, [
          {
            text: "今すぐアップデート",
            onPress: () => {
              Linking.openURL(result.storeUrlIOS);
            },
          },
          { text: "後で", style: "cancel", onPress: () => setChecked(true) },
        ]);
      } else {
        setChecked(true);
      }
    };

    run();
  }, []);

  if (!checked) return null; // 更新確認中は何も表示しない

  return <Redirect href="/PlayerScreen" />;
}
