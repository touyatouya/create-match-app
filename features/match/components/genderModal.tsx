import Toggle from "@/app/components/Toggle";
import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React, { useEffect } from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MarchScreenStyles } from "./styles";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GenderModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    genderSetting,
    setGenderSetting,
    gameRounds,
    courts,
    generateMode,
    players,
    pairs,
    isPreferMatchCountOverPair,
  } = React.useContext(AppContext);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "GenderSettingScreen",
    });
  }, []);

  const onChangeMan = async () => {
    let newGenderSetting = { ...genderSetting };
    setGenderSetting((prev) => {
      newGenderSetting = { ...prev, men: !prev.men };
      return newGenderSetting;
    });

    await clearGameData();
    await saveGameData({
      gameRounds,
      courts,
      generateMode: generateMode,
      recentPlayers: players,
      anonymousPlayerCount: players.filter((p) => p.isAnonymous).length,
      pairs,
      genderSetting: newGenderSetting,
      isPreferMatchCountOverPair,
      saveAt: new Date().getTime(),
    });

    await analytics().logEvent("change_man");
  };

  const onChangeWoman = async () => {
    let newGenderSetting = { ...genderSetting };
    setGenderSetting((prev) => {
      newGenderSetting = { ...prev, woman: !prev.woman };
      return newGenderSetting;
    });

    await clearGameData();
    await saveGameData({
      gameRounds,
      courts,
      generateMode: generateMode,
      recentPlayers: players,
      anonymousPlayerCount: players.filter((p) => p.isAnonymous).length,
      pairs,
      genderSetting: newGenderSetting,
      isPreferMatchCountOverPair,
      saveAt: new Date().getTime(),
    });

    await analytics().logEvent("change_woman");
  };

  const onChangeMix = async () => {
    let newGenderSetting = { ...genderSetting };
    setGenderSetting((prev) => {
      newGenderSetting = { ...prev, mix: !prev.mix };
      return newGenderSetting;
    });

    await clearGameData();
    await saveGameData({
      gameRounds,
      courts,
      generateMode: generateMode,
      recentPlayers: players,
      anonymousPlayerCount: players.filter((p) => p.isAnonymous).length,
      pairs,
      genderSetting: newGenderSetting,
      isPreferMatchCountOverPair,
      saveAt: new Date().getTime(),
    });

    await analytics().logEvent("change_mix");
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false}>
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: 20,
          backgroundColor: ColorPalette.pageBackground,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
            style={styles.headerButton}
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.modalTitleWrapper}>
            <Text style={styles.title}>性別設定</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={MarchScreenStyles.detailSettingSection}>
            <View style={styles.item}>
              <View style={[styles.itemBottomBorder, styles.row]}>
                <MaterialCommunityIcons
                  name="human-male-male"
                  size={24}
                  color="black"
                />
                <View style={{ flex: 1 }}>
                  <Toggle
                    label="なるべく男子ダブルス"
                    checked={genderSetting.men}
                    onChange={onChangeMan}
                  />
                </View>
              </View>
              <View style={[styles.itemBottomBorder, styles.row]}>
                <MaterialCommunityIcons
                  name="human-female-female"
                  size={24}
                  color="black"
                />
                <View style={{ flex: 1 }}>
                  <Toggle
                    label="なるべく女子ダブルス"
                    checked={genderSetting.woman}
                    onChange={onChangeWoman}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="human-male-female"
                  size={24}
                  color="black"
                />
                <View style={{ flex: 1 }}>
                  <Toggle
                    label="なるべくミックスダブルス"
                    checked={genderSetting.mix}
                    onChange={onChangeMix}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalTitleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    ...globalStyles.touch,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: ColorPalette.sectionTitle,
  },
  container: { padding: 16 },
  item: { marginBottom: 4 },
  itemBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailSetting: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ColorPalette.borderline,
    marginBottom: 4,
  },
});

export default GenderModal;
