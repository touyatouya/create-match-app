import { AppContext } from "@/context/AppContext";
import { Player } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CustomHeader from "../CustomHeader";
import ListEmptyText from "../ListEmptyText";
import PlayerItem from "../PlayerItem";

const EditRestScreen: React.FC = () => {
  const { players, setPlayers } = useContext(AppContext);

  const { playerId } = useLocalSearchParams();

  const id = Number(playerId);

  const togglePlayerRest = (id: number) => {
    setPlayers((prev) => {
      return prev.map((player) => {
        if (player.id === id) {
          return {
            ...player,
            isRest: !player.isRest,
          };
        }
        return {
          ...player,
        };
      });
    });
  };

  return (
    <>
      <CustomHeader title="休憩設定" isSlideScreen headerLeftText="試合" />
      <View style={styles.container}>
        <FlatList
          data={players.filter((player) => player.isJoin && player.id !== id)}
          renderItem={({ item }: { item: Player }) => (
            <PlayerItem
              item={item}
              onPress={() => togglePlayerRest(item.id)}
              isSelected={item.isRest}
              selectedText="休憩中"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ListEmptyText message="参加中プレイヤーがいません" />
          }
          style={styles.list}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    flex: 1,
  },
});

export default EditRestScreen;
