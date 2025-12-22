import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { generateUniqId } from "@/utils/createId";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import { Player } from "../../../types";
import MyAdmob, { BannerAdSize } from "../../components/MyAdmob";
import AddPlayerModal from "../../components/PlayerScreen/addPlayerModal";
// import FilterButtons from "./components/PlayerScreen/filterButtons";
import PlayerTable from "../../components/PlayerScreen/playerTable";
import PlayerTableHeader from "../../components/PlayerScreen/playerTableHeader";
import PrimaryButton from "../../components/PrimaryButton";
// import PurchaseModal from "./components/PurchaseModal";
// import analytics from "@react-native-firebase/analytics";
import CustomHeader from "../../components/CustomHeader";
import FabModal from "../../components/PlayerScreen/fabModal";

const PlayerScreen: React.FC = () => {
  const {
    players,
    setPlayers,
    setPairs,
    // setFilters,
    // isProUser,
    courts,
    setCourts,
    gameRounds,
    pairs,
  } = useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  // const [expanded, setExpanded] = useState(false);
  // const [defaultOrderPlayers, setDefaultOrderPlayers] = useState<Player[]>([]);
  // const [filteredFilters, setFilteredFilters] = useState<Filter[]>([]);
  // const [isOpenPurchaseModal, setIsOpenPurchaseModal] = useState(false);

  const isAddingRef = useRef(false);

  useEffect(() => {
    // analytics().logEvent("screen_view", {
    //   screen_name: "PlayerScreen",
    // });

    const loadData = async () => {
      const playersData = await AsyncStorage.getItem("players");
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
        // setDefaultOrderPlayers(players);
      }

      // const filtersData = await AsyncStorage.getItem("filters");
      // let filtersLength: number = 0;
      // if (filtersData) filtersLength = JSON.parse(filtersData).length;

      // if (filtersData && filtersLength > 0) {
      //   const parsedFilters = JSON.parse(filtersData);
      //   let filters: Filter[] = [];
      //   for (let i = 0; i < parsedFilters.length; i++) {
      //     filters.push({
      //       id: parsedFilters[i].id,
      //       name: parsedFilters[i].name,
      //       players: parsedFilters[i].players,
      //     });
      //   }
      //   setFilters(filters);
      // }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const filteredPlayers = players.filter((player) => {
  //   if (filteredFilters.length === 0) return true;
  //   return filteredFilters.flatMap((item) => item.players).includes(player.id);
  // });

  const joinedPlayer = players.filter((player) => player.isJoin);

  const joinAllPlayer = () => {
    const updatedPlayers = players.map((player) => {
      if (players.flatMap((p) => p.id).includes(player.id)) {
        return { ...player, isJoin: true };
      }
      return { ...player };
    });
    setPlayers(updatedPlayers);
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
      return [...prev, { id: id }];
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

    // await analytics().logEvent("to_match_screen", {
    //   player_count: players.length,
    //   court_count: courts.length,
    //   game_count: gameRounds.length,
    //   pairs: pairs.length,
    //   version: Constants.expoConfig?.version,
    // });
  };

  const openAddPlayerModal = async () => {
    setAddModalVisible(true);

    // await analytics().logEvent("open_add_player_modal_header", {
    //   player_count: players.length,
    //   court_count: courts.length,
    //   game_count: gameRounds.length,
    //   pairs: pairs.length,
    //   version: Constants.expoConfig?.version,
    // });
  };

  return (
    <View style={styles.page}>
      <CustomHeader
        title="試合準備"
        headerRight={() =>
          isEdit || (
            <>
              {/* <TouchableOpacity
                onPress={() => setIsOpenPurchaseModal(true)}
                style={globalStyles.headerLeft}
              >
                <FontAwesome
                  name="diamond"
                  size={24}
                  color={ColorPalette.normalIcon}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={openAddPlayerModal}
                style={globalStyles.headerRight}
              >
                <AntDesign name="plus" size={24} color={ColorPalette.link} />
              </TouchableOpacity>
            </>
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
      {/* <PurchaseModal
        isOpen={isOpenPurchaseModal}
        onClose={() => setIsOpenPurchaseModal(false)}
      /> */}
      <View style={styles.container}>
        <AddPlayerModal
          isOpen={isAddModalVisible}
          onClose={() => setAddModalVisible(false)}
          // setDefaultOrderPlayers={setDefaultOrderPlayers}
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
              // await analytics().logEvent("open_fab_menu", {
              //   player_count: players.length,
              //   court_count: courts.length,
              //   game_count: gameRounds.length,
              //   pairs: pairs.length,
              //   version: Constants.expoConfig?.version,
              // });
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
      {/* {!isProUser && <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />} */}
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
    marginBottom: 8,
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
});

export default PlayerScreen;
