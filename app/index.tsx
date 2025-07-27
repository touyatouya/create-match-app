import { AppContext } from "@/context/AppContext";
import { Redirect } from "expo-router";
import { useContext, useState } from "react";
// import {
//   AdsConsent,
//   AdsConsentDebugGeography,
//   AdsConsentStatus,
// } from "react-native-google-mobile-ads";

export default function Index() {
  const [nonPersonalizedOnly, setNonPersonalizedOnly] = useState(true);
  const { isProUser, setIsProUser } = useContext(AppContext);

  // useEffect(() => {
  //   // ATTとGDPRの同意状態を取得
  //   AdsConsent.requestInfoUpdate({
  //     debugGeography: AdsConsentDebugGeography.EEA, // EU圏としてテストする設定
  //     testDeviceIdentifiers: ["TEST-DEVICE-HASHED-ID"], // 実機でテストする場合はハッシュIDを指定
  //   }).then(async (consentInfo) => {
  //     let status = consentInfo.status;
  //     if (
  //       consentInfo.isConsentFormAvailable &&
  //       status === AdsConsentStatus.REQUIRED
  //     ) {
  //       // 同意状態が必要な場合はダイアログを表示する
  //       const result = await AdsConsent.showForm();
  //       status = result.status;
  //     }

  //     if (
  //       consentInfo.status === AdsConsentStatus.OBTAINED ||
  //       status === AdsConsentStatus.OBTAINED
  //     ) {
  //       // 同意が取得できた場合はNonPersonalizedOnlyをfalseにする(トラッキング取得する)
  //       setNonPersonalizedOnly(false);
  //     }
  //   });

  //   if (Platform.OS === "ios") {
  //     Purchases.configure({ apiKey: "appl_prIIHpEdeQhERPxdfLqNKAmppYN" });
  //   }

  //   const exec = async () => {
  //     try {
  //       const customerInfo = await Purchases.getCustomerInfo();
  //       if (typeof customerInfo.entitlements.active["pro"] !== "undefined") {
  //         setIsProUser(true);
  //       } else {
  //         setIsProUser(false);
  //       }
  //     } catch (e) {
  //       console.error("Error fetching customer info:", e);
  //     }
  //   };
  //   exec();
  // }, [setIsProUser]);

  return <Redirect href="/PlayerScreen" />;
}
