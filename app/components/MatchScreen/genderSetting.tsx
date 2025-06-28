import ColorPalette from "@/constants/color";
import { GenderPreferenceSetting } from "@/types";
import { Foundation } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Toggle from "../Toggle";
import { MarchScreenStyles } from "./styles";

interface GenderSettingProps {
  genderSetting: GenderPreferenceSetting;
  setGenderSetting: React.Dispatch<
    React.SetStateAction<GenderPreferenceSetting>
  >;
}

const GenderSetting: React.FC<GenderSettingProps> = ({
  genderSetting,
  setGenderSetting,
}) => (
  <View style={MarchScreenStyles.detailSettingSection}>
    <View style={MarchScreenStyles.settingTitle}>
      <Foundation
        name="male-female"
        size={20}
        color={ColorPalette.normalIcon}
      />
      <Text style={MarchScreenStyles.sectionText}>性別</Text>
    </View>
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
);

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

export default GenderSetting;
