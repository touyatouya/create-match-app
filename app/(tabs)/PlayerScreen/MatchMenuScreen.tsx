import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import GenderModal from "@/features/match/components/genderModal";
import PairModal from "@/features/match/components/pairModal";
import RestModal from "@/features/match/components/restModal";
import CustomHeader from "@/ui/CustomHeader";
import Loading from "@/ui/Loading";
import MyAdmob, { BannerAdSize } from "@/ui/MyAdmob";
import Toggle from "@/ui/Toggle";
import { clearGameData, saveGameData } from "@/utils/saveStorage";
import { Entypo, Feather, FontAwesome5, Foundation } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MatchMenuScreen: React.FC = () => {
  const {
    players,
    isLoading,
    pairs,
    genderSetting,
    setIsAdjustMatchCount,
    gameRounds,
    courts,
    generateMode,
    setPlayers,
    setPairs,
    setGenderSetting,
    isPreferMatchCountOverPair,
    setIsPreferMatchCountOverPair,
  } = useContext(AppContext);
  const [isOpenPairModal, setIsOpenPairModal] = React.useState(false);
  const [isOpenGenderModal, setIsOpenGenderModal] = React.useState(false);
  const [isOpenRestModal, setIsOpenRestModal] = React.useState(false);

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "MatchMenuScreen",
    });
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
        <RestModal
          isOpen={isOpenRestModal}
          onClose={() => setIsOpenRestModal(false)}
        />
        <View style={styles.detailSettingSection}>
          <TouchableOpacity
            onPress={async () => {
              setIsOpenRestModal(true);
            }}
            style={[styles.row]}
          >
            <Feather name="coffee" size={25} color={ColorPalette.blackText} />
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
                休憩
              </Text>
              <Text
                style={[
                  {
                    fontSize: FONT_SIZE.body,
                    color: ColorPalette.greyIcon2,
                    marginRight: 4,
                  },
                ]}
              >
                {players.filter((p) => p.isRest).length}人休憩中
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
              <Text
                style={[
                  {
                    fontSize: FONT_SIZE.body,
                    color: ColorPalette.greyIcon2,
                    marginRight: 4,
                  },
                ]}
              >
                {pairs.length}ペア
              </Text>
              <Entypo
                name="chevron-right"
                size={24}
                color={ColorPalette.greyIcon1}
              />
            </View>
          </TouchableOpacity>
          <View style={[styles.row]}>
            <FontAwesome5 name="balance-scale" size={20} color="black" />
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
                ペア設定より試合数を優先する
              </Text>
              <Toggle
                label=""
                checked={isPreferMatchCountOverPair}
                onChange={async () => {
                  let newIsPreferMatchCountOverPair =
                    isPreferMatchCountOverPair;
                  setIsPreferMatchCountOverPair((prev) => {
                    newIsPreferMatchCountOverPair = !prev;
                    return newIsPreferMatchCountOverPair;
                  });

                  await clearGameData();
                  await saveGameData({
                    gameRounds,
                    courts,
                    generateMode: generateMode,
                    recentPlayers: players,
                    anonymousPlayerCount: players.filter((p) => p.isAnonymous)
                      .length,
                    pairs,
                    genderSetting: genderSetting,
                    isPreferMatchCountOverPair: newIsPreferMatchCountOverPair,
                    saveAt: new Date().getTime(),
                  });

                  await analytics().logEvent("isPreferMatchCountOverPair");
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
          オン：ペア設定が反映されない場合がありますが、試合数が均等になるよう調整します。
          {"\n"}
          オフ：試合数に偏りが出ることがありますが、必ずペアで組まれます。
        </Text>
        <View style={[styles.detailSettingSection, { marginBottom: 32 }]}>
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
              <Text
                style={[
                  {
                    fontSize: FONT_SIZE.body,
                    color: ColorPalette.greyIcon2,
                    marginRight: 4,
                  },
                ]}
              >
                {!genderSetting.men &&
                  !genderSetting.woman &&
                  !genderSetting.mix &&
                  "未設定"}
                {genderSetting.men && "男"}
                {genderSetting.woman && "女"}
                {genderSetting.mix && "混"}
              </Text>
              <Entypo
                name="chevron-right"
                size={24}
                color={ColorPalette.greyIcon1}
              />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={async () => {
            let newPlayers = players;
            setPlayers((prev) => {
              newPlayers = prev.map((player) => {
                return { ...player, isRest: false };
              });
              return newPlayers;
            });

            setPairs([]);

            setGenderSetting({ men: false, woman: false, mix: false });

            setIsAdjustMatchCount(false);
            setIsPreferMatchCountOverPair(false);

            await clearGameData();
            await saveGameData({
              gameRounds,
              courts,
              generateMode: generateMode,
              recentPlayers: newPlayers,
              anonymousPlayerCount: newPlayers.filter((p) => p.isAnonymous)
                .length,
              pairs: [],
              genderSetting: { men: false, woman: false, mix: false },
              isPreferMatchCountOverPair: false,
              saveAt: new Date().getTime(),
            });
          }}
          style={[styles.detailSettingSection, styles.row]}
        >
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
                  color: ColorPalette.error,
                  flex: 1,
                },
              ]}
            >
              試合設定をリセット
            </Text>
          </View>
        </TouchableOpacity>
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
    marginBottom: 4,
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
