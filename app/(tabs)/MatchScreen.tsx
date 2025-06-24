import Match from "@/app/components/MatchScreen/match";
import { AppContext } from "@/context/AppContext";
import { router, useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Checkbox } from "react-native-paper";
import Colors from "@/constants/color";
import { globalStyles } from "@/styles/global";
import { GenderPreferenceSetting } from "../../types";
import Disclosure from "../components/Disclosure";
import Toggle from "../components/Toggle";

const MatchScreen: React.FC = () => {
  const { players, setPlayers, setGameRounds, isLoading } =
    useContext(AppContext);

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
        <TouchableOpacity
          onPress={() => {
            if (!isLoading) {
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
            }
          }}
          style={{
            ...globalStyles.touch,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: isLoading ? Colors.muted : Colors.link,
            }}
          >
            リセット
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, setGameRounds, setPlayers, isLoading]);

  const nextRestPlayer = players.filter(
    (player) => player.isJoin && player.isRest
  );

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
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.borderline,
                }}
              >
                <Toggle
                  label="なるべく男子ダブルス"
                  checked={genderSetting.men}
                  onChange={() =>
                    setGenderSetting((prev) => {
                      return { ...prev, men: !prev.men };
                    })
                  }
                />
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.borderline,
                }}
              >
                <Toggle
                  label="なるべく女子ダブルス"
                  checked={genderSetting.woman}
                  onChange={() =>
                    setGenderSetting((prev) => {
                      return { ...prev, woman: !prev.woman };
                    })
                  }
                />
              </View>
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
    color: Colors.emptyText,
    marginTop: 0,
  },
  allPlayerButton: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: Colors.secondary,
    borderWidth: 1,
    ...globalStyles.touch,
  },
  addButtonText: {
    color: Colors.secondary,
    marginLeft: 8,
    fontWeight: "600",
  },
  selectButtonText: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 12,
    width: "100%",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderline,
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
    color: Colors.sectionTitie,
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  generateButtonText: {
    color: Colors.whiteText,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  matchCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courtName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: Colors.sectionTitie,
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
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 6,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: Colors.borderline,
  },
  swapPlayerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
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
    color: Colors.sectionTitie,
    fontWeight: "500",
  },
  playerGender: {
    marginRight: 8,
  },
  vsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.remove,
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
    color: Colors.sectionTitie,
  },
  restingCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  restingPlayerItem: {
    alignItems: "baseline",
    backgroundColor: Colors.restPlayerBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.borderline,
    flex: 1,
  },
  restingPlayerName: {
    marginLeft: 6,
    fontSize: 24,
    color: Colors.restPlayerName,
    marginRight: 5,
  },
});

export default MatchScreen;
