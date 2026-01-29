import SegmentControl from "@/app/components/SegmentControl";
import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { STORAGE_KEYS } from "@/constants/storage";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { generateUniqId } from "@/utils/createId";
import { clearGameData } from "@/utils/saveStorage";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { GenerateMode, Player } from "../../../types";
import CustomHeader from "../../components/CustomHeader";
import MyAdmob, { BannerAdSize } from "../../components/MyAdmob";
import AddPlayerModal from "../../components/PlayerScreen/addPlayerModal";
import FabModal from "../../components/PlayerScreen/fabModal";
import PlayerTable from "../../components/PlayerScreen/playerTable";
import PlayerTableHeader from "../../components/PlayerScreen/playerTableHeader";
import PrimaryButton from "../../components/PrimaryButton";

const PlayerScreen: React.FC = () => {
  const {
    players,
    setPlayers,
    setPairs,
    courts,
    setCourts,
    gameRounds,
    setGameRounds,
    generateMode,
    setGenerateMode,
    isRestore,
    isAdjustMatchCount,
  } = useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const TOOLTIP_WIDTH = 260;
  const isAddingRef = useRef(false);

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "PlayerScreen",
    });

    const loadData = async () => {
      if (isRestore == null) return;
      if (isRestore) {
        toMatchScreen();
        return;
      }
      const playersData = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
      let playersDataLength: number = 0;
      if (playersData) playersDataLength = JSON.parse(playersData).length;

      if (playersData && playersDataLength > 0) {
        const parsedPlayers = JSON.parse(playersData);
        let players: Player[] = [];
        for (let i = 0; i < parsedPlayers.length; i++) {
          players.push({
            id: parsedPlayers[i].id,
            name: parsedPlayers[i].name,
            gender: parsedPlayers[i].gender,
            matchCount: 0,
            isJoin: false,
            isRest: false,
            rank: parsedPlayers[i].rank,
            isAnonymous: false,
            anonymousNumber: null,
          });
        }
        setPlayers(players);
      }
    };
    loadData();
  }, [isRestore, setPlayers]);

  const joinedPlayer = players.filter((player) => player.isJoin);

  const joinAllPlayer = () => {
    setPlayers((prev) => {
      return prev.map((player) => {
        const joinedMatchCounts = prev
          .filter((pl) => pl.isJoin)
          .map((pl) => pl.matchCount);
        const minCount =
          joinedMatchCounts.length > 0
            ? Math.min(...joinedMatchCounts)
            : player.matchCount;

        return {
          ...player,
          isJoin: true,
          matchCount: isAdjustMatchCount ? minCount : player.matchCount,
        };
      });
    });
  };

  const noJoinAllPlayer = () => {
    const updatedPlayers = players.map((player) => {
      return { ...player, isJoin: false };
    });
    setPlayers(updatedPlayers);
    setPairs([]);
  };

  const addCourt = () => {
    setCourts((prev) => {
      const courtIds = prev.map((court) => court.id);
      const id = generateUniqId(courtIds);
      return [...prev, { id: id, number: prev.length + 1 }];
    });
  };

  const removeCourt = () => {
    setCourts((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, index) => prev.length - 1 !== index);
    });
  };

  const toMatchScreen = async () => {
    router.push({ pathname: "/PlayerScreen/MatchScreen" });

    await analytics().logEvent("to_match_screen", {
      player_count: players.length,
      court_count: courts.length,
    });
  };

  const openAddPlayerModal = async () => {
    setAddModalVisible(true);

    await analytics().logEvent("open_add_player_modal_header", {
      player_count: players.length,
      court_count: courts.length,
      game_count: gameRounds.length,
    });
  };

  return (
    <View style={styles.page}>
      {tooltipVisible && (
        <Pressable
          style={styles.overlay}
          onPress={() => setTooltipVisible(false)}
        />
      )}

      <CustomHeader
        title="試合準備"
        headerRight={() =>
          isEdit || (
            <TouchableOpacity
              onPress={openAddPlayerModal}
              style={globalStyles.headerRight}
            >
              <AntDesign name="plus" size={24} color={ColorPalette.link} />
            </TouchableOpacity>
          )
        }
        headerLeft={() =>
          isEdit ? (
            <TouchableOpacity
              onPress={() => setIsEdit(false)}
              style={globalStyles.headerLeft}
            >
              <Text style={globalStyles.headerText}>完了</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEdit(true)}
              style={globalStyles.headerLeft}
            >
              <Text style={globalStyles.headerText}>編集</Text>
            </TouchableOpacity>
          )
        }
      />
      <View style={styles.container}>
        <AddPlayerModal
          isOpen={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          isAddingRef={isAddingRef}
        />
        <View style={styles.court}>
          <Text
            style={{
              fontSize: FONT_SIZE.subsubheading,
              fontWeight: "bold",
            }}
          >
            コート数
          </Text>
          <View style={styles.courtCard}>
            <TouchableOpacity style={styles.button} onPress={removeCourt}>
              <Feather
                name="minus-circle"
                size={24}
                color={ColorPalette.primary}
              />
            </TouchableOpacity>
            <Text style={styles.count}>{courts.length}</Text>
            <TouchableOpacity style={styles.button} onPress={addCourt}>
              <Feather
                name="plus-circle"
                size={24}
                color={ColorPalette.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.court, { marginBottom: 2 }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZE.subsubheading,
                fontWeight: "bold",
              }}
            >
              作成方式
            </Text>
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.button}
                onPressIn={() => setTooltipVisible(true)}
                onPress={() => setTooltipVisible(true)}
                activeOpacity={0.8}
              >
                <FontAwesome
                  name="question-circle"
                  size={22}
                  color={ColorPalette.checked}
                />
              </TouchableOpacity>
              {tooltipVisible && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      width: TOOLTIP_WIDTH,
                      left: 30,
                      top: 60,
                    },
                  ]}
                >
                  <Text
                    style={styles.tooltipText}
                    numberOfLines={6}
                    ellipsizeMode="tail"
                  >
                    一括　　：全コート同時に試合作成
                    {"\n"}
                    流し込み：空いたコートから試合作成
                  </Text>
                  <View style={styles.bubbleArrow} />
                </View>
              )}
            </View>
          </View>
          <View
            style={[
              styles.courtCard,
              {
                flex: 1,
                backgroundColor: ColorPalette.whiteIcon,
                borderRadius: 8,
              },
            ]}
          >
            <SegmentControl
              options={[
                { label: "一括", value: GenerateMode.REPLACE_ALL },
                { label: "流し込み", value: GenerateMode.FILL_ENPTY },
              ]}
              value={generateMode}
              onChange={(v) => {
                if (v === generateMode) return;
                if (gameRounds.length > 0) {
                  Alert.alert(
                    "作成方式の変更",
                    "既に作成された試合データはクリアされます。よろしいですか？",
                    [
                      {
                        text: "キャンセル",
                        style: "cancel",
                      },
                      {
                        text: "変更する",
                        onPress: () => {
                          setGameRounds([]);
                          setPlayers((prev) => {
                            return prev.map((player) => {
                              return {
                                ...player,
                                isRest: false,
                                matchCount: 0,
                              };
                            });
                          });
                          clearGameData();

                          setGenerateMode(v);
                        },
                        style: "destructive",
                      },
                    ],
                  );
                  return;
                }
                setGenerateMode(v);
              }}
            />
          </View>
        </View>
        <View style={styles.player}>
          <Text
            style={{
              fontSize: FONT_SIZE.subsubheading,
              fontWeight: "bold",
              flex: 1,
            }}
          >
            プレイヤー選択
          </Text>
          <View style={styles.peopleCard}>
            <View style={styles.textView}>
              <Text
                style={[
                  styles.playerNum,
                  {
                    color:
                      joinedPlayer.length / (courts.length * 4) >= 1
                        ? ColorPalette.blackText
                        : ColorPalette.error,
                  },
                ]}
              >
                {joinedPlayer.length}
              </Text>
              <Text style={[styles.playerNum]}>／{courts.length * 4}人</Text>
            </View>
            <View style={styles.progress}>
              <Progress.Bar
                progress={joinedPlayer.length / (courts.length * 4)}
                color={
                  joinedPlayer.length / (courts.length * 4) >= 1
                    ? ColorPalette.primary
                    : ColorPalette.progress
                }
                width={null}
                height={3}
              />
            </View>
          </View>
        </View>

        <PlayerTableHeader
          filteredPlayers={players}
          joinAllPlayer={joinAllPlayer}
          noJoinAllPlayer={noJoinAllPlayer}
        />
        <View style={{ flex: 1 }}>
          <PlayerTable
            filteredPlayers={players}
            isEdit={isEdit}
            isAddingRef={isAddingRef}
          />
          <FabModal
            isOpen={menuVisible}
            setMenuVisible={setMenuVisible}
            setAddModalVisible={setAddModalVisible}
            isAddingRef={isAddingRef}
          />
          <TouchableOpacity
            style={styles.fab}
            onPress={async () => {
              setMenuVisible(true);
              await analytics().logEvent("open_fab_menu", {
                player_count: players.length,
                court_count: courts.length,
                game_count: gameRounds.length,
              });
            }}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <PrimaryButton
          onPress={toMatchScreen}
          text="組み合わせ生成画面へ"
          disabled={joinedPlayer.length < courts.length * 4}
        />
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
};

const styles = StyleSheet.create({
  court: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
  },
  player: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 30,
    backgroundColor: ColorPalette.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ColorPalette.blackText,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  textView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  courtCard: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  peopleCard: {
    alignItems: "center",
    flex: 1.2,
  },
  progress: { width: "100%" },
  count: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: FONT_SIZE.subsubheading,
    color: ColorPalette.blackText,
    width: 20,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    ...globalStyles.touch,
  },
  page: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    backgroundColor: ColorPalette.pageBackground,
    borderTopWidth: 0.5,
    borderTopColor: ColorPalette.pageHeaderFooterBorder,
  },
  courtTitle: {
    width: "100%",
  },
  playerNum: {
    fontSize: FONT_SIZE.body,
    flexShrink: 1,
  },
  joinedPlayer: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: 600,
  },
  tooltip: {
    position: "absolute",
    right: 0,
    top: 36,
    backgroundColor: ColorPalette.blackText,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 250,
    maxWidth: 250,
    maxHeight: 300,
    zIndex: 20,
    elevation: 8,
  },
  tooltipText: {
    color: ColorPalette.whiteText,
    fontSize: FONT_SIZE.small,
    lineHeight: 16,
    flexWrap: "wrap",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  bubbleArrow: {
    position: "absolute",
    top: -6,
    left: "60%",
    marginLeft: -6,
    width: 14,
    height: 14,
    backgroundColor: ColorPalette.blackText,
    transform: [{ rotate: "45deg" }],
    zIndex: 21,
  },
});

export default PlayerScreen;
