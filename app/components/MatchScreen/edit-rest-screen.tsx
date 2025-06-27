import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { Player } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomHeader from "../CustomHeader";

const EditRestScreen: React.FC = () => {
  const { players, setPlayers } = useContext(AppContext);

  const router = useRouter();

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

  const renderPlayer = ({ item }: { item: Player }) => (
    <TouchableOpacity
      onPress={() => togglePlayerRest(item.id)}
      style={[styles.playerItem, item.isRest && styles.selectedPlayerItem]}
    >
      <Text
        style={[styles.playerName, item.isRest && styles.selectedPlayerName]}
      >
        {item.name}
      </Text>
      {item.isRest && (
        <View style={styles.restBadge}>
          <Text style={styles.restText}>休憩中</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <CustomHeader title="休憩設定" isSlideScreen headerLeftText="試合" />
      <View style={styles.container}>
        <FlatList
          data={players.filter((player) => player.isJoin && player.id !== id)}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>参加中プレイヤーがいません</Text>
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
  playerItem: {
    backgroundColor: ColorPalette.background,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: ColorPalette.borderline,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 4,
    paddingRight: 4,
  },
  selectedPlayerItem: {
    backgroundColor: ColorPalette.secondary,
    paddingLeft: 14,
    paddingRight: 14,
  },
  playerName: {
    flex: 2,
    paddingHorizontal: 4,
    fontSize: FONT_SIZE.title,
  },
  selectedPlayerName: {
    color: ColorPalette.whiteText,
  },
  restBadge: {
    flexDirection: "row",
    backgroundColor: ColorPalette.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  restText: {
    color: ColorPalette.whiteText,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: ColorPalette.emptyText,
    marginTop: 20,
  },
});

export default EditRestScreen;
