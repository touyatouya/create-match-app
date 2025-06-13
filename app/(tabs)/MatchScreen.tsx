import Match from "@/app/components/MatchScreen/match";
import { AppContext } from "@/context/AppContext";
import { router, useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Checkbox } from "react-native-paper";
import { GenderPreferenceSetting } from "../../types";
import Disclosure from "../components/Disclosure";
import Toggle from "../components/Toggle";

const MatchScreen: React.FC = () => {
  const { players, setPlayers, setGameRounds } = useContext(AppContext);

  const [genderSetting, setGenderSetting] = useState<GenderPreferenceSetting>({
    men: false,
    woman: false,
    mix: false,
  });

  const [expanded, setExpanded] = useState(false);
  const [swapPlayer, setSwapPlayer] = useState<number | null>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="リセット"
          onPress={() => {
            setGameRounds([]);
            setPlayers((prev) => {
              return prev.map((player) => {
                return {
                  ...player,
                  isRest: false,
                  matchCount: 0,
                };
              });
            });
            setSwapPlayer(null);
          }}
        />
      ),
    });
  }, [navigation, setGameRounds, setPlayers]);

  const nextRestPlayer = players.filter((player) => player.isRest);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={styles.item}>
        <Disclosure
          isOpen={expanded}
          setIsOpen={setExpanded}
          label="詳細設定"
        />
        {expanded && (
          <View style={styles.modalContent}>
            <Text style={styles.title}>性別</Text>
            <View>
              <Toggle
                label="なるべく男子ダブルス"
                checked={genderSetting.men}
                onChange={() =>
                  setGenderSetting((prev) => {
                    return { ...prev, men: !prev.men };
                  })
                }
              />
              <Toggle
                label="なるべく女子ダブルス"
                checked={genderSetting.woman}
                onChange={() =>
                  setGenderSetting((prev) => {
                    return { ...prev, woman: !prev.woman };
                  })
                }
              />
              <Toggle
                label="なるべくミックスダブルス"
                checked={genderSetting.mix}
                onChange={() =>
                  setGenderSetting((prev) => {
                    return { ...prev, mix: !prev.mix };
                  })
                }
              />
            </View>
            <Text style={styles.title}>休憩</Text>
            <View>
              <TouchableOpacity
                style={styles.allPlayerButton}
                onPress={() =>
                  router.push({
                    pathname: "/components/MatchScreen/edit-rest-screen",
                  })
                }
              >
                <Text style={styles.addButtonText}>
                  次回休憩にするプレイヤー選択
                </Text>
              </TouchableOpacity>
              {nextRestPlayer.length > 0 ? (
                <>
                  <Text style={styles.title}>次回休憩プレイヤー</Text>
                  <FlatList
                    data={nextRestPlayer}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.restingPlayerItem}>
                        <Text key={item.id} style={styles.restingPlayerName}>
                          {item.name}
                        </Text>
                      </View>
                    )}
                  />
                </>
              ) : (
                <Text style={styles.emptyText}>
                  次回休憩にするプレイヤーはいません
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
      <Match
        swapPlayer={swapPlayer}
        setSwapPlayer={setSwapPlayer}
        genderSetting={genderSetting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  restPlayers: {
    flexDirection: "row",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 0,
  },
  allPlayerButton: {
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  selectButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    width: "100%",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    paddingVertical: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#6200EE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  generateButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  matchCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courtName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  teams: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  team: {
    flex: 1,
    gap: 4,
  },
  playerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  swapPlayerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#cc7838",
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  playerName: {
    fontSize: 24,
    color: "#333",
    fontWeight: "500",
  },
  playerGender: {
    marginRight: 8,
  },
  vsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginHorizontal: 6,
  },
  restingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  restingTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  restingSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  restingPlayerItem: {
    alignItems: "baseline",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // borderColor: "#FFE8B2",
    flex: 1,
  },
  restingSwapPlayerItem: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#cc7838",
    // borderColor: "#FFE8B2",
    flex: 1,
  },
  restingPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: "#664500",
    marginRight: 5,
  },
});

export default MatchScreen;
