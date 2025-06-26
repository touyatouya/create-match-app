import Colors from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { saveFilters, savePairs, savePlayerInfo } from "@/utils/saveStorage";
import { AntDesign, Foundation } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Filter, Gender, Pair, Player } from "../../types";
import Checkbox from "../components/CheckBox";
import Disclosure from "../components/Disclosure";
import AddPlayerModal from "../components/PlayerScreen/addPlayerModal";

type Sort = "asc" | "desc";

const PlayerScreen: React.FC = () => {
  const { players, setPlayers, pairs, setPairs, filters, setFilters } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isSortedMatchCount, setIsSortedMatchCount] =
    React.useState<Sort | null>(null);
  // const [isSortedJoin, setIsSortedJoin] = React.useState<Sort | null>(null);
  const [isSortedGender, setIsSortedGender] = React.useState<Sort | null>(null);
  const [isSortedPair, setIsSortedPair] = React.useState<Sort | null>(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [defaultOrderPlayers, setDefaultOrderPlayers] = useState<Player[]>([]);
  // const [joinedPlayer, setJoinedPlayer] = useState<Player[]>([]);

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

      const pairsData = await AsyncStorage.getItem("pairs");
      let pairsLength: number = 0;
      if (pairsData) pairsLength = JSON.parse(pairsData).length;

      if (pairsData && pairsLength > 0) {
        const parsedPairs = JSON.parse(pairsData);
        let pairs: Pair[] = [];
        for (let i = 0; i < parsedPairs.length; i++) {
          pairs.push({
            id: parsedPairs[i].id,
            player1: parsedPairs[i].player1,
            player2: parsedPairs[i].player2,
          });
        }
        setPairs(pairs);
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

  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isEdit || (
          <TouchableOpacity
            onPress={() => setAddModalVisible(true)}
            style={{
              ...globalStyles.touch,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ marginRight: 8 }}>
              <AntDesign name="plus" size={24} color={Colors.link} />
            </View>
          </TouchableOpacity>
        ),
      headerLeft: () =>
        isEdit ? (
          <TouchableOpacity
            onPress={() => setIsEdit(false)}
            style={{
              ...globalStyles.touch,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 6,
                fontSize: FONT_SIZE.subsubheading,
                color: Colors.link,
              }}
            >
              完了
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsEdit(true)}
            style={{
              ...globalStyles.touch,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 6,
                fontSize: FONT_SIZE.subsubheading,
                color: Colors.link,
              }}
            >
              編集
            </Text>
          </TouchableOpacity>
        ),
    });
  }, [isEdit, navigation, router]);

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

    const pairPlayers = pairs.flatMap((pair) => [pair.player1, pair.player2]);
    if (pairPlayers.includes(id)) {
      const newPairs = pairs.filter(
        (pair) => pair.player1 !== id && pair.player2 !== id
      );
      setPairs(newPairs);
      savePairs(newPairs);
    }

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
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, isJoin: !player.isJoin } : player
    );
    setPlayers(updatedPlayers);

    // setJoinedPlayer((prev) => {
    //   const newJoinedPlayer = players.find((player) => player.id === id);
    //   if (
    //     prev.filter((player) => player.id === id).length === 0 &&
    //     newJoinedPlayer != null
    //   ) {
    //     return [...prev, { ...newJoinedPlayer, isJoin: true }];
    //   } else {
    //     return prev.filter((player) => player.id !== id);
    //   }
    // });
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

  const sortPair = () => {
    const nextSortOrder = isSortedPair === "asc" ? "desc" : "asc";
    const sorted = [...players].sort((a, b) => {
      const pairA = pairs.find(
        (pair) => pair.player1 === a.id || pair.player2 === a.id
      );
      const pairB = pairs.find(
        (pair) => pair.player1 === b.id || pair.player2 === b.id
      );

      const hasPairA = pairA ? 1 : 0;
      const hasPairB = pairB ? 1 : 0;

      if (isSortedPair === "asc") {
        return hasPairB - hasPairA;
      } else {
        return hasPairA - hasPairB;
      }
    });

    setIsSortedPair(nextSortOrder);
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
            color={Colors.normalIcon}
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
            color={Colors.normalIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.removeButton, styles.headerText]}></Text>
    </View>
  );

  const renderItem = ({ item }: { item: Player }) => (
    <View
      style={[styles.row, item.isJoin && { backgroundColor: Colors.secondary }]}
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
          <AntDesign name="minuscircle" size={24} color={Colors.error} />
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
            item.isJoin && { color: Colors.whiteText },
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
              // color={item.isJoin ? "#001d5c" : Colors.men}
              color={Colors.men}
              // style={{ borderColor: "black", borderWidth: 1 }}
            />
          ) : item.gender === Gender.女性 ? (
            <Foundation
              name="female"
              size={24}
              // color={item.isJoin ? Colors.whiteText : Colors.women}
              color={Colors.women}
            />
          ) : (
            ""
          )}
        </Text>
        <Text
          style={[styles.cellMatch, item.isJoin && { color: Colors.whiteText }]}
        >
          {item.matchCount}
        </Text>
      </TouchableOpacity>
      {isEdit ? (
        <View style={styles.removeButton}></View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/player-edit-screen",
              params: { playerId: item.id },
            })
          }
          style={styles.removeButton}
        >
          <AntDesign
            name="right"
            size={24}
            color={item.isJoin ? Colors.whiteIcon : Colors.normalIcon}
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

  const flatListRef = useRef<FlatList<any>>(null);

  const isAddingRef = useRef(false);

  const handleContentSizeChange = () => {
    if (isAddingRef.current) {
      flatListRef.current?.scrollToEnd({ animated: true });
      isAddingRef.current = false;
    }
  };

  return (
    <View style={styles.container}>
      {/* <Button title="ローカルストレージを削除" onPress={clearStorage} /> */}
      <AddPlayerModal
        isOpen={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        setDefaultOrderPlayers={setDefaultOrderPlayers}
        isAddingRef={isAddingRef}
      />
      <View style={styles.title}>
        <Text style={styles.description}>参加プレイヤーを選択してください</Text>
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
              style={{ color: Colors.link, fontSize: FONT_SIZE.subsubheading }}
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
                        color={Colors.whiteIcon}
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
        <TouchableOpacity style={styles.Button} onPress={sortJoin}>
          <Text style={styles.ButtonText}>参加プレイヤーを上へ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={resetOrder}>
          <Text style={styles.ButtonText}>並び順リセット</Text>
        </TouchableOpacity>
      </View>
      {renderHeader()}
      <FlatList
        onContentSizeChange={handleContentSizeChange}
        ref={flatListRef}
        data={filteredPlayers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {"プレイヤーがいません。\n 右上の＋から追加してください。"}
          </Text>
        }
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Button: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: Colors.secondary,
    borderWidth: 1,
    flex: 1,
    ...globalStyles.touch,
  },
  ButtonText: {
    color: Colors.secondary,
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
    backgroundColor: Colors.filterItemBg,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.secondary,
    flex: 1,
    flexDirection: "row",
    columnGap: 5,
  },
  selectedFilterItem: {
    backgroundColor: Colors.secondary,
    borderStyle: "solid",
  },
  filterItemName: {
    fontSize: FONT_SIZE.body,
    color: Colors.filterItemName,
  },
  selectedFilterItemName: {
    color: Colors.whiteText,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    backgroundColor: Colors.playerTabelHeader,
  },
  headerText: {
    fontWeight: 600,
    // textAlign: "center",
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
    // justifyContent: "center",
    // width:""
  },
  cellPair: {
    flex: 2,
    marginHorizontal: 4,
    fontSize: FONT_SIZE.small,
    justifyContent: "center",
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
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  pairInfo: {
    flexDirection: "row",
    flex: 2,
    fontSize: FONT_SIZE.subheading,
    fontWeight: "500",
    justifyContent: "flex-start",
    alignItems: "baseline",
  },
  pairName: {
    justifyContent: "flex-start",
    fontSize: FONT_SIZE.body,
    fontWeight: "500",
  },
  removeButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...globalStyles.touch,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.emptyText,
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
