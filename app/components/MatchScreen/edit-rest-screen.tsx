import { AppContext } from "@/context/AppContext";
import { Player } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CustomHeader from "../CustomHeader";
import ListEmptyText from "../ListEmptyText";
import PlayerItem from "../PlayerItem";
import RewardAdButton from "../rewardAdButton";

const EditRestScreen: React.FC = () => {
  const { players, setPlayers, isRestUnlocked, setIsRestUnlocked } =
    useContext(AppContext);

  const { playerId } = useLocalSearchParams();

  const id = Number(playerId);

  const togglePlayerRest = (id: number) => {
    const targetPlayer = players.find((player) => player.id === id);
    if (isRestUnlocked) {
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
    } else {
      if (targetPlayer?.isRest) {
        setPlayers((prev) => {
          return prev.map((player) => {
            return {
              ...player,
              isRest: false,
            };
          });
        });
      } else {
        setPlayers((prev) => {
          return prev.map((player) => {
            if (player.id === id) {
              return {
                ...player,
                isRest: true,
              };
            }
            return {
              ...player,
              isRest: false,
            };
          });
        });
      }
    }
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
        {!isRestUnlocked && (
          <RewardAdButton
            onPress={() => setIsRestUnlocked(true)}
            text="動画を見て休憩を複数人選択できるようにする"
          />
        )}
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
