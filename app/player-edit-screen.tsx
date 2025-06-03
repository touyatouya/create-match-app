import { AppContext } from "@/context/AppContext";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useNavigation, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Pair, Player } from "../types";

const PlayerEditScreen: React.FC = () => {
  const { players, pairs, setPairs } = useContext(AppContext);
  const [pair, setPair] = useState<number[]>([]);

  const navigation = useNavigation();
  const router = useRouter();

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Button
  //         title="ペア編集"
  //         onPress={() => alert("追加ボタンが押されました")}
  //       />
  //     ),
  //     headerLeft: () => (
  //       <Button title="<プレイヤー" onPress={() => router.back()} />
  //     ),
  //   });
  // }, [navigation, router]);

  const savePairs = async (
    pairs: { id: number; player1: number; player2: number }[]
  ) => {
    try {
      await AsyncStorage.setItem("pairs", JSON.stringify(pairs));
    } catch (e) {
      console.error("保存エラー:", e);
    }
  };

  const selectPlayer = (id: number) => {
    setPair((prev) => {
      let newPair: number[] = [];
      if (prev.some((p) => p === id)) {
        newPair = prev.filter((p) => p !== id);
      } else if (prev.length === 2) {
        newPair = [prev[0], id];
      } else {
        newPair = [...prev, id];
      }

      return newPair;
    });
  };

  const createPair = () => {
    let newPairs: Pair[] = [];

    if (pair.length !== 2)
      return Alert.alert("2人選んでください", "", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);

    setPairs((prev) => {
      const pairIds = prev.map((pair) => pair.id);
      let newPairId: number;
      do {
        newPairId = Math.floor(Math.random() * 10000); // 1〜10000の自然数
      } while (pairIds.includes(newPairId));

      const newPair: Pair = {
        id: prev.length + 1,
        player1: pair[0],
        player2: pair[1],
      };
      newPairs = [...prev, newPair];
      return newPairs;
    });
    setPair([]);
    savePairs(
      newPairs.map((pair) => {
        return { id: pair.id, player1: pair.player1, player2: pair.player2 };
      })
    );
  };

  // const renderPlayer = ({ item }: { item: Player }) => (
  //   <TouchableOpacity onPress={() => selectPlayer(item.id)}>
  //     <View
  //       style={
  //         pair.some((p) => item.id === p)
  //           ? styles.joinPlayerItem
  //           : styles.restPlayerItem
  //       }
  //     >
  //       <View style={styles.playerInfo}>
  //         <Text style={styles.playerName}>{item.name}</Text>
  //       </View>
  //       {pair.some((p) => item.id === p) && (
  //         <View style={styles.joinBadge}>
  //           <Text style={styles.joinText}>選択中</Text>
  //         </View>
  //       )}
  //     </View>
  //   </TouchableOpacity>
  // );

  const NotPaierPlayer = players.filter(
    (player) =>
      !pairs.find(
        (pair) => pair.player1 === player.id || pair.player2 === player.id
      )
  );

  type SectionDataItem = Pair | Player;

  type Section = {
    title: string;
    type: "pairs" | "players";
    data: SectionDataItem[];
  };

  const sections: Section[] = [
    {
      title: "",
      data: pairs,
      type: "pairs",
    },
    {
      title: "ペア未設定プレイヤー",
      data: NotPaierPlayer,
      type: "players",
    },
  ];

  const removePair = (id: number): void => {
    let newPairs: Pair[] = [];
    setPairs((prev) => {
      newPairs = prev.filter((player) => player.id !== id);
      return newPairs;
    });
    savePairs(
      newPairs.map((pair) => {
        return { id: pair.id, player1: pair.player1, player2: pair.player2 };
      })
    );
  };

  // const renderPair = ({ item }: { item: Pair }) => (
  //   <View style={styles.restPlayerItem}>
  //     <View style={styles.playerInfo}>
  //       <Text style={styles.playerName}>
  //         {players.find((player) => player.id === item.player1)?.name}
  //       </Text>
  //       <Text style={styles.playerName}>-</Text>
  //       <Text style={styles.playerName}>
  //         {players.find((player) => player.id === item.player2)?.name}
  //       </Text>
  //     </View>
  //     <TouchableOpacity
  //       onPress={() => removePair(item.id)}
  //       style={styles.removeButton}
  //     >
  //       <Ionicons name="close-circle" size={24} color="#FF6B6B" />
  //     </TouchableOpacity>
  //   </View>
  // );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "プレイヤー設定",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign name="left" size={24} color="rgb(0, 122, 255)" />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 16,
                  color: "rgb(0, 122, 255)",
                }}
              >
                プレイヤー
              </Text>
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
      <View style={styles.container}>
        <View style={styles.item}>
          <Ionicons
            name="person-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <View style={styles.info}>
            <Text style={styles.label}>プレイヤー名</Text>
            <Text style={styles.value}>田中 太郎</Text>
          </View>
        </View>

        <View style={styles.item}>
          <FontAwesome5
            name="handshake"
            size={20}
            color="black"
            style={styles.icon}
          />
          <View style={styles.info}>
            <Text style={styles.label}>ペア</Text>
            <Text style={styles.value}>佐藤 花子</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>ペア編集</Text>
          </TouchableOpacity>
        </View>

        {/* レベル */}
        <View style={styles.item}>
          <FontAwesome6 name="ranking-star" size={24} color="black" />
          <View style={styles.info}>
            <Text style={styles.label}>レベル</Text>
            <Text style={styles.value}>A</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>レベル変更</Text>
          </TouchableOpacity>
        </View>
        {/* <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={({ item, section }) => {
            if (section.type === "pairs") {
              const pairs = item as Pair;
              return renderPair({ item: pairs }); // 例: カード表示など
            } else if (section.type === "players") {
              const player = item as Player;
              return renderPlayer({ item: player }); // 例: 名前だけ表示など
            }
            return null;
          }}
          renderSectionHeader={({ section }) => {
            if (section.type === "pairs") {
              return (
                <View style={styles.pairHeader}>
                  <View style={styles.restingTitle}>
                    <MaterialCommunityIcons
                      name="human-male-male"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.restingSectionTitle}>ペア一覧</Text>
                  </View>
                </View>
              );
            } else if (section.type === "players") {
              return (
                <View style={styles.playerHeader}>
                  <View style={styles.restingTitle}>
                    <MaterialCommunityIcons
                      name="human-male"
                      size={24}
                      color="black"
                    />
                    <Text style={styles.restingSectionTitle}>
                      ペア未設定プレイヤー
                    </Text>
                  </View>
                </View>
              );
            }
            return null;
          }}
          // contentContainerStyle={styles.sectionListContainer}
        />
        <TouchableOpacity style={styles.allPlayerButton} onPress={createPair}>
          <Text style={styles.addButtonText}>ペア作成</Text>
        </TouchableOpacity> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    paddingVertical: 16,
  },
  icon: {
    width: 30,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    marginTop: 2,
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
  },
});
export default PlayerEditScreen;
