import CustomHeader from "@/app/components/CustomHeader";
import { MarchScreenStyles } from "@/app/components/MatchScreen/styles";
import MyAdmob, { BannerAdSize } from "@/app/components/MyAdmob";
import Toggle from "@/app/components/Toggle";
import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import React from "react";
import { StyleSheet, View } from "react-native";

const GenderSettingScreen: React.FC = () => {
  const { genderSetting, setGenderSetting } = React.useContext(AppContext);
  return (
    <>
      <CustomHeader title="性別設定" isSlideScreen headerLeftText="試合" />
      <View style={styles.container}>
        <View style={MarchScreenStyles.detailSettingSection}>
          <View style={styles.item}>
            <View style={styles.itemBottomBorder}>
              <Toggle
                label="なるべく男子ダブルス"
                checked={genderSetting.men}
                onChange={() =>
                  setGenderSetting((prev) => {
                    return { ...prev, men: !prev.men };
                  })
                }
              />
            </View>
            <View style={styles.itemBottomBorder}>
              <Toggle
                label="なるべく女子ダブルス"
                checked={genderSetting.woman}
                onChange={() =>
                  setGenderSetting((prev) => {
                    return { ...prev, woman: !prev.woman };
                  })
                }
              />
            </View>
            <Toggle
              label="なるべくミックスダブルス"
              checked={genderSetting.mix}
              onChange={() =>
                setGenderSetting((prev) => {
                  return { ...prev, mix: !prev.mix };
                })
              }
            />
          </View>
        </View>
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { marginBottom: 4 },
  itemBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
  },
  detailSetting: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ColorPalette.borderline,
    marginBottom: 4,
  },
});

export default GenderSettingScreen;
