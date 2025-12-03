import firestore from "@react-native-firebase/firestore";
import * as Application from "expo-application";

export const checkForUpdate = async () => {
  try {
    // Firestore の app_config/version を取得
    const doc = await firestore().collection("app_config").doc("version").get();

    const data = doc.data();
    if (!data) return;

    const latestVersion = data.latest_version;
    const storeUrlIOS = data.store_url_ios;

    // 現在のアプリバージョン
    const currentVersion = Application.nativeApplicationVersion ?? "1.5.0";

    // ① バージョン比較（例：1.5.0 → [1,5,0] にして比較）
    const canUpdate = isVersionNewer(latestVersion, currentVersion);

    if (canUpdate) {
      return {
        updateAvailable: true,
        message: data.message,
        storeUrlIOS,
      };
    }

    return { updateAvailable: false };
  } catch (e) {
    console.log("update check error:", e);
    return { updateAvailable: false };
  }
};

// バージョン番号比較関数
const isVersionNewer = (a: string, b: string) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return true;
    if (na < nb) return false;
  }
  return false;
};
