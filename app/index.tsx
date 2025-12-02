import {
  initRemoteConfig,
  isLatestVersion,
  showUpdateDialog,
} from "@/utils/initRemoteConfig";
import { Redirect } from "expo-router";
import { useEffect } from "react";
// import Purchases from "react-native-purchases";

export default function Index() {
  useEffect(() => {
    const checkUpdate = async () => {
      await initRemoteConfig();

      if (!isLatestVersion()) {
        showUpdateDialog();
      }
    };
    checkUpdate();
  }, []);

  return <Redirect href="/PlayerScreen" />;
}
