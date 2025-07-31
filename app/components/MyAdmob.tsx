// import { AppContext } from "@/context/AppContext";
// import React, { useContext } from "react";
// import { View } from "react-native";
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";

// interface Props {
//   size: BannerAdSize;
// }

// export default function MyAdmob(props: Props) {
//   const { isProUser } = useContext(AppContext);
//   //   const { nonPersonalizedOnly } = useContext(TrackingContext);

//   // テスト用のID
//   // 実機テスト時に誤ってタップしたりすると、広告の配信停止をされたりするため、テスト時はこちらを設定する
//   const unitId = TestIds.BANNER;

//   // 実際に広告配信する際のID
//   // 広告ユニット（バナー）を作成した際に表示されたものを設定する
//   // const adUnitID = Platform.select({
//   //   ios: "ca-app-pub-1546884469851348/1540733171",
//   //   android: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy",
//   // });

//   // プレミアムユーザーは広告を表示しない
//   if (isProUser) {
//     return <View />;
//   }

//   return (
//     <BannerAd
//       {...props}
//       unitId={unitId}
//       //   requestOptions={{ requestNonPersonalizedAdsOnly: !!nonPersonalizedOnly }}
//     />
//   );
// }
