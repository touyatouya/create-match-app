import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
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

const RestSetting: React.FC = () => {
  const { players } = useContext(AppContext);

  const nextRestPlayer = players.filter(
    (player) => player.isJoin && player.isRest
  );

  return (
    <View style={MarchScreenStyles.detailSettingSection}>
      <View style={MarchScreenStyles.settingTitle}>
        <Ionicons name="cafe" size={20} />
        <Text style={MarchScreenStyles.sectionText}>休憩</Text>
      </View>
      <View style={{ marginBottom: 8, paddingHorizontal: 8 }}>
        <TouchableOpacity
          style={styles.selectRestPlayerButton}
          onPress={() =>
            router.push({
              pathname: "/components/MatchScreen/edit-rest-screen",
            })
          }
        >
          <Text style={styles.selectRestPlayerButtonText}>
            次回休憩にするプレイヤー選択
          </Text>
        </TouchableOpacity>
        {nextRestPlayer.length > 0 ? (
          <View>
            <Text style={MarchScreenStyles.subSectionText}>
              次回休憩プレイヤー
            </Text>
            <FlatList
              data={nextRestPlayer}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.restingPlayerItem}>
                  <Text
                    key={item.id}
                    style={MarchScreenStyles.settingPlayerNameText}
                  >
                    {item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        ) : (
          <Text style={MarchScreenStyles.emptyText}>
            次回休憩にするプレイヤーはいません
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectRestPlayerButton: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#827101",
    borderWidth: 1,
    ...globalStyles.touch,
  },
  selectRestPlayerButtonText: {
    color: "#827101",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: FONT_SIZE.small,
  },
  restingPlayerItem: {
    alignItems: "baseline",
    backgroundColor: ColorPalette.restPlayerBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    flex: 1,
  },
});

export default RestSetting;
