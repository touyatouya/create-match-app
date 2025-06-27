import ColorPalette from "@/constants/color";
import { GenderPreferenceSetting } from "@/types";
import { Foundation } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        columnGap: 4,
      }}
    >
      <Foundation
        name="male-female"
        size={20}
        color={ColorPalette.normalIcon}
      />
      <Text style={MarchScreenStyles.sectionText}>性別</Text>
    </View>
    <View style={{ marginBottom: 4 }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: ColorPalette.borderline,
        }}
      >
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
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: ColorPalette.borderline,
        }}
      >
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

export default GenderSetting;
