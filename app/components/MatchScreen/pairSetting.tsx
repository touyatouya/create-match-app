import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MarchScreenStyles } from "./styles";
import { getPlayerName } from "./util";

const PairSetting: React.FC = () => {
  const { players, pairs } = useContext(AppContext);

  return (
    <View style={MarchScreenStyles.detailSettingSection}>
      <View style={MarchScreenStyles.settingTitle}>
        <FontAwesome5
          name="handshake"
          size={20}
          color={ColorPalette.normalIcon}
        />
        <Text style={MarchScreenStyles.sectionText}>ペア</Text>
      </View>
      <View style={{ marginBottom: 4, paddingHorizontal: 8 }}>
        <TouchableOpacity
          style={styles.pairEditButton}
          onPress={() =>
            router.push({
              pathname: "/components/MatchScreen/pair-screen",
            })
          }
        >
          <Text style={styles.pairEditButtonText}>ペア設定</Text>
        </TouchableOpacity>
        {pairs.length > 0 ? (
          <>
            <Text style={MarchScreenStyles.subSectionText}>ペア一覧</Text>
            <FlatList
              data={pairs}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.pairItem}>
                  <Text
                    key={item.id}
                    style={MarchScreenStyles.settingPlayerNameText}
                  >
                    {`${getPlayerName(item.player1, players)}・${getPlayerName(
                      item.player2,
                      players
                    )}`}
                  </Text>
                </View>
              )}
            />
          </>
        ) : (
          <Text style={MarchScreenStyles.emptyText}>ペアはありません</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pairEditButton: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: ColorPalette.secondary,
    borderWidth: 1,
    ...globalStyles.touch,
  },
  pairEditButtonText: {
    color: ColorPalette.secondary,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: FONT_SIZE.small,
  },
  pairItem: {
    alignItems: "baseline",
    backgroundColor: ColorPalette.thirdry,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    flex: 1,
  },
});

export default PairSetting;
