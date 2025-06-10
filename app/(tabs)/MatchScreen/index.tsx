import { AppContext } from "@/context/AppContext";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  Button,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { GenderPreferenceSetting } from "../../../types";
import Match from "./match";

const MatchScreen: React.FC = () => {
  const { setPlayers, setGameRounds } = useContext(AppContext);

  const [genderSetting, setGenderSetting] = useState<GenderPreferenceSetting>({
    enabled: false,
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

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={styles.item}>
        <TouchableOpacity onPress={toggleExpanded} style={styles.genderEdit}>
          <Text style={styles.title}>性別設定</Text>
          <AntDesign name={expanded ? "up" : "down"} size={20} color="black" />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() =>
                setGenderSetting((prev) => {
                  return { ...prev, enabled: false };
                })
              }
            >
              <View style={styles.radioOuter}>
                {!genderSetting.enabled && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionText}>性別を考慮しない</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() =>
                setGenderSetting((prev) => {
                  return { ...prev, enabled: true };
                })
              }
            >
              <View style={styles.radioOuter}>
                {genderSetting.enabled && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionText}>性別を考慮する</Text>
            </TouchableOpacity>
            {genderSetting.enabled && (
              <View>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() =>
                    setGenderSetting((prev) => {
                      return { ...prev, men: !prev.men };
                    })
                  }
                >
                  <View
                    style={{
                      padding: 0,
                      backgroundColor: genderSetting.men
                        ? "#007AFF"
                        : "#f0f0f0",
                      borderWidth: genderSetting.men ? 0 : 1,
                      borderColor: genderSetting.men ? "none" : "#f0f0f0",
                    }}
                  >
                    <Checkbox
                      status={genderSetting.men ? "checked" : "unchecked"}
                      onPress={() =>
                        setGenderSetting((prev) => {
                          return { ...prev, men: !prev.men };
                        })
                      }
                      color="white" // ✅ チェック時の色
                    />
                  </View>
                  <Text style={styles.optionText}>なるべく男子ダブルス</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() =>
                    setGenderSetting((prev) => {
                      return { ...prev, woman: !prev.woman };
                    })
                  }
                >
                  <View
                    style={{
                      padding: 0,
                      backgroundColor: genderSetting.woman
                        ? "#007AFF"
                        : "#f0f0f0",
                      borderWidth: genderSetting.woman ? 0 : 1,
                      borderColor: genderSetting.woman ? "none" : "#f0f0f0",
                    }}
                  >
                    <Checkbox
                      status={genderSetting.woman ? "checked" : "unchecked"}
                      onPress={() =>
                        setGenderSetting((prev) => {
                          return { ...prev, woman: !prev.woman };
                        })
                      }
                      color="white" // ✅ チェック時の色
                    />
                  </View>
                  <Text style={styles.optionText}>なるべく女子ダブルス</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() =>
                    setGenderSetting((prev) => {
                      return { ...prev, mix: !prev.mix };
                    })
                  }
                >
                  <View
                    style={{
                      padding: 0,
                      backgroundColor: genderSetting.mix
                        ? "#007AFF"
                        : "#f0f0f0",
                      borderWidth: genderSetting.mix ? 0 : 1,
                      borderColor: genderSetting.mix ? "none" : "#f0f0f0",
                    }}
                  >
                    <Checkbox
                      status={genderSetting.mix ? "checked" : "unchecked"}
                      onPress={() =>
                        setGenderSetting((prev) => {
                          return { ...prev, mix: !prev.mix };
                        })
                      }
                      color="white" // ✅ チェック時の色
                    />
                  </View>
                  <Text style={styles.optionText}>
                    なるべくミックスダブルス
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    padding: 24,
    borderRadius: 12,
    width: "80%",
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
    paddingVertical: 16,
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
  genderEdit: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
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
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
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
