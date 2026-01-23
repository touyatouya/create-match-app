import CustomHeader from "@/app/components/CustomHeader";
import Loading from "@/app/components/Loading";
import MyAdmob, { BannerAdSize } from "@/app/components/MyAdmob";
import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
// import analytics from "@react-native-firebase/analytics";
import GenderModal from "@/app/components/MatchScreen/genderModal";
import PairModal from "@/app/components/MatchScreen/pairModal";
import { FONT_SIZE } from "@/constants/fonts";
import { Entypo, FontAwesome5, Foundation } from "@expo/vector-icons";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MatchMenuScreen: React.FC = () => {
  const { players, isLoading, courts, gameRounds } = useContext(AppContext);
  const [isOpenPairModal, setIsOpenPairModal] = React.useState(false);
  const [isOpenGenderModal, setIsOpenGenderModal] = React.useState(false);

  useEffect(() => {
    // analytics().logEvent("screen_view", {
    //   screen_name: "MatchMenuScreen",
    // });
  }, []);

  return (
    <>
      <CustomHeader title="試合設定" isSlideScreen headerLeftText="試合" />
      <View style={styles.container}>
        <GenderModal
          isOpen={isOpenGenderModal}
          onClose={() => setIsOpenGenderModal(false)}
        />
        <PairModal
          isOpen={isOpenPairModal}
          onClose={() => setIsOpenPairModal(false)}
        />
        <View style={styles.detailSettingSection}>
          <TouchableOpacity
            onPress={async () => {
              setIsOpenPairModal(true);
            }}
            style={[styles.row]}
          >
            <FontAwesome5
              name="handshake"
              size={20}
              color={ColorPalette.blackText}
            />
            <View
              style={[
                {
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  height: 44,
                },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: FONT_SIZE.body,
                    flex: 1,
                  },
                ]}
              >
                ペア作成
              </Text>

              <Entypo
                name="chevron-right"
                size={24}
                color={ColorPalette.greyIcon1}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              setIsOpenGenderModal(true);
            }}
            style={[styles.row]}
          >
            <Foundation
              name="male-female"
              size={27}
              color={ColorPalette.blackText}
            />
            <View
              style={[
                {
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  height: 44,
                  marginLeft: 0.3,
                },
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: FONT_SIZE.body,
                    flex: 1,
                  },
                ]}
              >
                性別設定
              </Text>

              <Entypo
                name="chevron-right"
                size={24}
                color={ColorPalette.greyIcon1}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      {isLoading && <Loading />}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  detailSettingSection: {
    backgroundColor: ColorPalette.background,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 12,
    width: "100%",
    marginBottom: 8,
  },
  item: { marginBottom: 4 },
  itemBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    height: 44,
  },
  detailSetting: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ColorPalette.borderline,
    marginBottom: 4,
  },
});

export default MatchMenuScreen;
