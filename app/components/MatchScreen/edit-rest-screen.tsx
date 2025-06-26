import Colors from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { Player } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
        <View style={styles.joinBadge}>
          <Text style={styles.joinText}>休憩中</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "休憩設定",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <AntDesign name="left" size={24} color={Colors.link} />
              <Text
                style={{
                  marginLeft: 3,
                  fontSize: FONT_SIZE.body,
                  color: Colors.link,
                }}
              >
                試合
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={players.filter((player) => player.isJoin && player.id !== id)}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              プレイヤーがいません。追加してください。
            </Text>
          }
          style={styles.list}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.transparent,
    zIndex: 9999,
  },
  centerToast: {
    backgroundColor: Colors.background,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toastText: {
    marginTop: 12,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: Colors.sectionTitie,
  },
  pairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 12,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  allPlayerButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: Colors.whiteText,
    marginLeft: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addPlayerContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  list: {
    flex: 1,
  },
  joinPlayerItem: {
    flexDirection: "row",
    backgroundColor: Colors.cardBackGround,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playerItem: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderline,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "space-between",
    shadowColor: Colors.cardShadow,
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
    backgroundColor: Colors.secondary,
    paddingLeft: 14,
    paddingRight: 14,
  },
  selectedBadge: {
    flexDirection: "row",
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    flex: 2,
    paddingHorizontal: 4,
    fontSize: FONT_SIZE.title,
  },
  selectedPlayerName: {
    color: Colors.whiteText,
  },
  playerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  matchCountBadge: {
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  joinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.badgeBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  allJoinBadge: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  joinText: {
    color: Colors.whiteText,
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 4,
    display: "flex",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.emptyText,
    marginTop: 20,
  },
  joinedPlayer: {
    marginBottom: 6,
  },
});

export default EditRestScreen;
