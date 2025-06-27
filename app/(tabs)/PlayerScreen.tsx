import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { saveFilters, savePlayerInfo } from "@/utils/saveStorage";
import { AntDesign, Foundation, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Filter, Gender, Player } from "../../types";
import Checkbox from "../components/CheckBox";
import CustomHeader from "../components/CustomHeader";
import Disclosure from "../components/Disclosure";
import AddPlayerModal from "../components/PlayerScreen/addPlayerModal";

type Sort = "asc" | "desc";

const PlayerScreen: React.FC = () => {
  const { players, setPlayers, pairs, setPairs, filters, setFilters } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isSortedMatchCount, setIsSortedMatchCount] =
    React.useState<Sort | null>(null);
  const [isSortedGender, setIsSortedGender] = React.useState<Sort | null>(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [defaultOrderPlayers, setDefaultOrderPlayers] = useState<Player[]>([]);

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

  const router = useRouter();

  const removePlayer = (id: number): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newPlayers = players.filter((player) => player.id !== id);
    setPlayers(newPlayers);
    savePlayerInfo(
      newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
          gender: player.gender,
          rank: player.rank,
        };
      })
    );

    setDefaultOrderPlayers((prev) => {
      return prev.filter((player) => player.id !== id);
    });

    const filterPlayers = filters.flatMap((filter) => [...filter.players]);
    if (filterPlayers.includes(id)) {
      const newFilters = filters
        .map((filter) => {
          return {
            ...filter,
            players: filter.players.filter((player) => player !== id),
          };
        })
        .filter((filter) => filter.players.length > 0);
      setFilters(newFilters);
      saveFilters(newFilters);
    }
  };

  const joinPlayer = (id: number): void => {
    const targetPlayer = players.find((player) => player.id === id);

    if (targetPlayer?.isJoin) {
      const updatePairs = pairs.filter(
        (pair) => pair.player1 !== id && pair.player2 !== id
      );
      setPairs(updatePairs);
    }

    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, isJoin: !player.isJoin } : player
    );
    setPlayers(updatedPlayers);
  };

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

  const sortMatchCount = () => {
    const nextSortOrder = isSortedMatchCount === "asc" ? "desc" : "asc";

    const sorted = [...players].sort((a, b) => {
      return nextSortOrder === "asc"
        ? a.matchCount - b.matchCount
        : b.matchCount - a.matchCount;
    });

    setIsSortedMatchCount(nextSortOrder);
    setPlayers(sorted);
  };

  const genderOrder = {
    [Gender.男性]: 1,
    [Gender.女性]: 2,
    [Gender.未設定]: 3,
  };

  const sortGender = () => {
    const nextSortOrder = isSortedGender === "asc" ? "desc" : "asc";

    const sorted = [...players].sort((a, b) => {
      return nextSortOrder === "asc"
        ? genderOrder[a.gender] - genderOrder[b.gender]
        : genderOrder[b.gender] - genderOrder[a.gender];
    });

    setIsSortedGender(nextSortOrder);
    setPlayers(sorted);
  };

  const sortJoin = () => {
    const sorted = [...players].sort((a, b) => {
      return (b.isJoin ? 1 : 0) - (a.isJoin ? 1 : 0);
    });
    setPlayers(sorted);
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Checkbox
        checked={
          filteredPlayers.length > 0 &&
          filteredPlayers.every((player) => player.isJoin)
        }
        onChange={
          filteredPlayers.every((player) => player.isJoin)
            ? noJoinAllPlayer
            : joinAllPlayer
        }
      />
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <View style={[styles.cellName, { flex: 7 }]}>
          <Text style={[styles.headerText]}>名前</Text>
        </View>
        <TouchableOpacity
          onPress={sortGender}
          style={[
            styles.cellGender,
            {
              ...globalStyles.touch,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.headerText]}>性別</Text>
          <AntDesign
            name={isSortedGender === "asc" ? "arrowup" : "arrowdown"}
            size={14}
            color={ColorPalette.normalIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={sortMatchCount}
          style={[
            styles.cellMatch,
            {
              ...globalStyles.touch,
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.headerText]}>試合数</Text>
          <AntDesign
            name={isSortedMatchCount === "asc" ? "arrowup" : "arrowdown"}
            size={14}
            color={ColorPalette.normalIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.endIconButton, styles.headerText]}></Text>
    </View>
  );

  const renderItem = ({ item, drag }: RenderItemParams<Player>) => (
    <View
      style={[
        styles.row,
        item.isJoin && { backgroundColor: ColorPalette.secondary },
      ]}
    >
      {isEdit && (
        <TouchableOpacity
          onPress={() => removePlayer(item.id)}
          style={[
            {
              ...globalStyles.touch,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <AntDesign name="minuscircle" size={24} color={ColorPalette.error} />
        </TouchableOpacity>
      )}
      {isEdit || (
        <Checkbox checked={item.isJoin} onChange={() => joinPlayer(item.id)} />
      )}
      <TouchableOpacity
        onPress={() => joinPlayer(item.id)}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          ...globalStyles.touch,
        }}
      >
        <Text
          style={[
            styles.cellName,
            ,
            item.isJoin && { color: ColorPalette.whiteText },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.cellGender,
            {
              textAlign: "center",
            },
          ]}
        >
          {item.gender === Gender.男性 ? (
            <Foundation
              name="male"
              size={24}
              // color={item.isJoin ? "#001d5c" : ColorPalette.men}
              color={ColorPalette.men}
              // style={{ borderColor: "black", borderWidth: 1 }}
            />
          ) : item.gender === Gender.女性 ? (
            <Foundation
              name="female"
              size={24}
              // color={item.isJoin ? ColorPalette.whiteText : ColorPalette.women}
              color={ColorPalette.women}
            />
          ) : (
            ""
          )}
        </Text>
        <Text
          style={[
            styles.cellMatch,
            item.isJoin && { color: ColorPalette.whiteText },
          ]}
        >
          {item.matchCount}
        </Text>
      </TouchableOpacity>
      {isEdit ? (
        <TouchableOpacity onPressIn={drag} style={styles.endIconButton}>
          <MaterialIcons
            name="drag-handle"
            size={24}
            color={ColorPalette.normalIcon}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/player-edit-screen",
              params: { playerId: item.id },
            })
          }
          style={styles.endIconButton}
        >
          <AntDesign
            name="right"
            size={24}
            color={
              item.isJoin ? ColorPalette.whiteIcon : ColorPalette.normalIcon
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const [filteredFilters, setFilteredFilters] = useState<Filter[]>([]);

  const filteredPlayers = players.filter((player) => {
    if (filteredFilters.length === 0) return true;
    return filteredFilters.flatMap((item) => item.players).includes(player.id);
  });

  const selectFilter = (id: number) => {
    setFilteredFilters((prev) => {
      if (prev.some((item) => item.id === id)) {
        return prev.filter((item) => item.id !== id);
      } else {
        const selectedFilter = filters.find((filter) => filter.id === id);
        if (selectedFilter == null) return prev;
        else return [...prev, selectedFilter];
      }
    });
  };

  // const clearStorage = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //     Alert.alert("ローカルストレージがクリアされました");
  //   } catch (e) {
  //     Alert.alert("エラー", "ローカルストレージの削除に失敗しました");
  //   }
  // };

  const resetOrder = () => {
    const playerWithIndex = players.map((player) => {
      return {
        ...player,
        defaultIndex: defaultOrderPlayers.findIndex(
          (defaultOrdepplayer) => defaultOrdepplayer.id === player.id
        ),
      };
    });

    const defaultPlayers = playerWithIndex.sort(
      (a, b) => a.defaultIndex - b.defaultIndex
    );

    const newPlayers = defaultPlayers.map(
      ({ defaultIndex, ...player }) => player
    );
    setPlayers(newPlayers);
  };

  const flatListRef = useRef<any>(null);

  const isAddingRef = useRef(false);

  const handleContentSizeChange = () => {
    if (isAddingRef.current) {
      flatListRef.current?.scrollToEnd({ animated: true });
      isAddingRef.current = false;
    }
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
        {/* <Button title="ローカルストレージを削除" onPress={clearStorage} /> */}
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
          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/components/PlayerScreen/filter-screen",
                })
              }
              style={{
                alignItems: "flex-end",
                marginBottom: 8,
                justifyContent: "center",
                ...globalStyles.touch,
              }}
            >
              <Text
                style={{
                  color: ColorPalette.link,
                  fontSize: FONT_SIZE.subsubheading,
                }}
              >
                フィルター一覧
              </Text>
            </TouchableOpacity>
            <View>
              <FlatList
                data={filters}
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      marginRight: 8,
                      ...globalStyles.touch,
                    }}
                    onPress={() => selectFilter(item.id)}
                  >
                    <View
                      style={[
                        styles.filterItem,
                        filteredFilters.some(
                          (filterFilter) => filterFilter.id === item.id
                        ) && styles.selectedFilterItem,
                      ]}
                    >
                      <Text
                        key={item.id}
                        style={[
                          styles.filterItemName,
                          filteredFilters.some(
                            (filterFilter) => filterFilter.id === item.id
                          ) && styles.selectedFilterItemName,
                        ]}
                      >
                        {item.name}
                      </Text>

                      {filteredFilters.some(
                        (filterFilter) => filterFilter.id === item.id
                      ) && (
                        <AntDesign
                          name="closecircle"
                          size={16}
                          color={ColorPalette.whiteIcon}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        )}
        <View style={{ flexDirection: "row", columnGap: 8, marginBottom: 8 }}>
          <TouchableOpacity style={styles.button} onPress={sortJoin}>
            <Text style={styles.buttonText}>参加プレイヤーを上へ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetOrder}>
            <Text style={styles.buttonText}>並び順リセット</Text>
          </TouchableOpacity>
        </View>
        {renderHeader()}
        <DraggableFlatList
          onContentSizeChange={handleContentSizeChange}
          ref={flatListRef}
          data={filteredPlayers}
          onDragEnd={({ data }) => {
            setPlayers(data);
            setDefaultOrderPlayers(data);
            savePlayerInfo(
              data.map((player) => {
                return {
                  id: player.id,
                  name: player.name,
                  gender: player.gender,
                  rank: player.rank,
                };
              })
            );
          }}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {"プレイヤーがいません。\n 右上の＋から追加してください。"}
            </Text>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: ColorPalette.secondary,
    borderWidth: 1,
    flex: 1,
    ...globalStyles.touch,
  },
  buttonText: {
    color: ColorPalette.secondary,
    fontWeight: 600,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorPalette.filterItemBg,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: ColorPalette.secondary,
    flex: 1,
    flexDirection: "row",
    columnGap: 5,
  },
  selectedFilterItem: {
    backgroundColor: ColorPalette.secondary,
    borderStyle: "solid",
  },
  filterItemName: {
    fontSize: FONT_SIZE.body,
    color: ColorPalette.filterItemName,
  },
  selectedFilterItemName: {
    color: ColorPalette.whiteText,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    backgroundColor: ColorPalette.playerTabelHeader,
  },
  headerText: {
    fontWeight: 600,
    fontSize: FONT_SIZE.small,
  },
  cellName: {
    flex: 2,
    paddingHorizontal: 4,
    fontSize: FONT_SIZE.subheading,
  },
  cellGender: {
    flex: 1,
    marginHorizontal: 4,
    fontSize: FONT_SIZE.small,
    flexDirection: "row",
  },
  cellMatch: {
    flex: 1,
    marginHorizontal: 4,
    textAlign: "center",
    fontSize: FONT_SIZE.small,
    flexDirection: "row",
    justifyContent: "center",
  },
  endIconButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...globalStyles.touch,
  },
  emptyText: {
    textAlign: "center",
    color: ColorPalette.emptyText,
    marginTop: 20,
  },
  joinedPlayer: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: 500,
  },
  description: {
    fontSize: FONT_SIZE.subheading,
    fontWeight: 500,
    flexShrink: 1,
  },
});

export default PlayerScreen;
