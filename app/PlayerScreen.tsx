import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { generateUniqId } from "@/utils/createId";
import { AntDesign, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import { Player } from "../types";
import CustomHeader from "./components/CustomHeader";
import MyAdmob, { BannerAdSize } from "./components/MyAdmob";
import AddPlayerModal from "./components/PlayerScreen/addPlayerModal";
// import FilterButtons from "./components/PlayerScreen/filterButtons";
import PlayerTable from "./components/PlayerScreen/playerTable";
import PlayerTableHeader from "./components/PlayerScreen/playerTableHeader";
import PrimaryButton from "./components/PrimaryButton";
// import PurchaseModal from "./components/PurchaseModal";

const PlayerScreen: React.FC = () => {
  const {
    players,
    setPlayers,
    setPairs,
    // setFilters,
    // isProUser,
    courts,
    setCourts,
  } = useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  // const [expanded, setExpanded] = useState(false);
  // const [defaultOrderPlayers, setDefaultOrderPlayers] = useState<Player[]>([]);
  // const [filteredFilters, setFilteredFilters] = useState<Filter[]>([]);
  // const [isOpenPurchaseModal, setIsOpenPurchaseModal] = useState(false);

  const isAddingRef = useRef(false);

  useEffect(() => {
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
                onPress={() => setAddModalVisible(true)}
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
        <Text
          style={{
            fontSize: FONT_SIZE.subsubheading,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          コート数
        </Text>
        <View style={styles.matchCard}>
          <View style={styles.courtBlock}>
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
        <View style={styles.matchCard}>
          <View style={styles.textView}>
            <Text style={styles.playerNum}>人数：</Text>
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
                  ? ColorPalette.success
                  : ColorPalette.progress
              }
              width={null}
            />
          </View>
        </View>
        <Text
          style={{
            fontSize: FONT_SIZE.subsubheading,
            fontWeight: "bold",
            marginVertical: 8,
          }}
        >
          プレイヤー選択
        </Text>
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
            setAddModalVisible={setAddModalVisible}
          />
        </View>
        <PrimaryButton
          onPress={() =>
            router.push({
              pathname: "/MatchScreen",
            })
          }
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
  textView: { flexDirection: "row", alignItems: "center" },
  matchCard: {
    backgroundColor: ColorPalette.background,
    borderRadius: 8,
    padding: 6,
    marginBottom: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  progress: { width: "100%", paddingHorizontal: 16 },
  courtBlock: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 16,
  },
  count: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: FONT_SIZE.subsubheading,
    color: ColorPalette.blackText,
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
    padding: 16,
  },
  courtTitle: {
    width: "100%",
  },
  playerNum: {
    fontSize: FONT_SIZE.body,
    flexShrink: 1,
    marginBottom: 4,
  },
  joinedPlayer: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: 600,
  },
});

export default PlayerScreen;
