import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import CustomHeader from "@/ui/CustomHeader";
import MyAdmob, { BannerAdSize } from "@/ui/MyAdmob";
import Toggle from "@/ui/Toggle";
import { saveIsAdjustMatchCount } from "@/utils/saveStorage";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import * as WebBrowser from "expo-web-browser";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MenuScreen: React.FC = () => {
  const { isAdjustMatchCount, setIsAdjustMatchCount } = useContext(AppContext);
  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "MenuScreen",
    });
  }, []);

  return (
    <>
      <CustomHeader title="メニュー" disabled />
      <View style={styles.container}>
        <View style={styles.detailSettingSection}>
          <TouchableOpacity
            onPress={async () => {
              const url = "https://forms.gle/RwjTxbqa47drHHEE6";
              try {
                await WebBrowser.openBrowserAsync(url);
              } catch (e) {}

              await analytics().logEvent("contact_us");
            }}
            style={[styles.row]}
          >
            <MaterialCommunityIcons
              name="message-question-outline"
              size={24}
              color="black"
            />
            <View
              style={[
                styles.itemBottomBorder,
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
                お問い合わせ
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
              const url = "https://forms.gle/RwjTxbqa47drHHEE6";
              try {
                await WebBrowser.openBrowserAsync(url);
              } catch (e) {}

              await analytics().logEvent("suggest_new");
            }}
            style={[styles.row]}
          >
            <MaterialCommunityIcons
              name="lightbulb-on-10"
              size={24}
              color="black"
            />
            <View
              style={[
                styles.itemBottomBorder,
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
                新機能の提案・改善点の要望
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
              const url =
                "https://sites.google.com/view/create-match-app-instruction";
              try {
                await WebBrowser.openBrowserAsync(url);
              } catch (e) {}

              await analytics().logEvent("how_to_use");
            }}
            style={[styles.row]}
          >
            <MaterialCommunityIcons
              name="book-open-blank-variant-outline"
              size={24}
              color="black"
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
                使い方・よくある質問
              </Text>

              <Entypo
                name="chevron-right"
                size={24}
                color={ColorPalette.greyIcon1}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.detailSettingSection}>
          <View style={[styles.row]}>
            <MaterialCommunityIcons
              name="account-plus"
              size={24}
              color="black"
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
                途中参加の試合数調整
              </Text>
              <Toggle
                label=""
                checked={isAdjustMatchCount}
                onChange={async () => {
                  let newIsAdjustMatchCount = isAdjustMatchCount;
                  setIsAdjustMatchCount((prev) => {
                    newIsAdjustMatchCount = !prev;
                    return newIsAdjustMatchCount;
                  });

                  await saveIsAdjustMatchCount(newIsAdjustMatchCount);

                  await analytics().logEvent("isAdjustMatchCount");
                }}
              />
            </View>
          </View>
        </View>
        <Text
          style={{
            paddingHorizontal: 16,
            color: ColorPalette.greyIcon2,
            fontSize: FONT_SIZE.small,
            marginBottom: 16,
          }}
        >
          オンにすると、途中参加したプレイヤーの試合数を他のプレイヤーの最低試合数に合わせて調整します。
        </Text>
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
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

export default MenuScreen;
