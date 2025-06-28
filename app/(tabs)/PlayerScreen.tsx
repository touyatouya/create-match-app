import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Filter, Player } from "../../types";
import CustomHeader from "../components/CustomHeader";
import Disclosure from "../components/Disclosure";
import AddPlayerModal from "../components/PlayerScreen/addPlayerModal";
import FilterButtons from "../components/PlayerScreen/filterButtons";
import HeaderSortButtons from "../components/PlayerScreen/headerSortButtons";
import PlayerTable from "../components/PlayerScreen/playerTable";
import PlayerTableHeader from "../components/PlayerScreen/playerTableHeader";

const PlayerScreen: React.FC = () => {
  const { players, setPlayers, setPairs, setFilters } = useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [defaultOrderPlayers, setDefaultOrderPlayers] = useState<Player[]>([]);
  const [filteredFilters, setFilteredFilters] = useState<Filter[]>([]);

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
        setDefaultOrderPlayers(players);
      }

      const filtersData = await AsyncStorage.getItem("filters");
      let filtersLength: number = 0;
      if (filtersData) filtersLength = JSON.parse(filtersData).length;

      if (filtersData && filtersLength > 0) {
        const parsedFilters = JSON.parse(filtersData);
        let filters: Filter[] = [];
        for (let i = 0; i < parsedFilters.length; i++) {
          filters.push({
            id: parsedFilters[i].id,
            name: parsedFilters[i].name,
            players: parsedFilters[i].players,
          });
        }
        setFilters(filters);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPlayers = players.filter((player) => {
    if (filteredFilters.length === 0) return true;
    return filteredFilters.flatMap((item) => item.players).includes(player.id);
  });

  const joinedPlayer = players.filter((player) => player.isJoin);

  const joinAllPlayer = () => {
    const updatedPlayers = players.map((player) => {
      if (
        filteredPlayers
          .flatMap((filteredPlayer) => filteredPlayer.id)
          .includes(player.id)
      ) {
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

  return (
    <>
      <CustomHeader
        title="プレイヤー"
        headerRight={() =>
          isEdit || (
            <TouchableOpacity
              onPress={() => setAddModalVisible(true)}
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
          setDefaultOrderPlayers={setDefaultOrderPlayers}
          isAddingRef={isAddingRef}
        />
        <View style={styles.title}>
          <Text style={styles.description}>
            参加プレイヤーを選択してください
          </Text>
          <Text style={styles.joinedPlayer}>{joinedPlayer.length}人</Text>
        </View>
        <View style={{ marginBottom: 8 }}>
          <Disclosure
            isOpen={expanded}
            setIsOpen={setExpanded}
            label="絞り込み"
          />
        </View>
        {expanded && (
          <FilterButtons
            filteredFilters={filteredFilters}
            setFilteredFilters={setFilteredFilters}
          />
        )}
        <HeaderSortButtons defaultOrderPlayers={defaultOrderPlayers} />
        <PlayerTableHeader
          filteredPlayers={filteredPlayers}
          joinAllPlayer={joinAllPlayer}
          noJoinAllPlayer={noJoinAllPlayer}
        />
        <PlayerTable
          filteredPlayers={filteredPlayers}
          setDefaultOrderPlayers={setDefaultOrderPlayers}
          isEdit={isEdit}
          isAddingRef={isAddingRef}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  description: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: 500,
    flexShrink: 1,
  },
  joinedPlayer: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: 500,
  },
});

export default PlayerScreen;
