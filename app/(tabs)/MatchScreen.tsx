import Match from "@/app/components/MatchScreen/match";
import { AppContext } from "@/context/AppContext";
import { router, useNavigation } from "expo-router";
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { Checkbox } from "react-native-paper";
import Colors from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { GenderPreferenceSetting } from "../../types";
import Disclosure from "../components/Disclosure";
import Toggle from "../components/Toggle";

const MatchScreen: React.FC = () => {
  const { players, setPlayers, setGameRounds, pairs } = useContext(AppContext);

  const [genderSetting, setGenderSetting] = useState<GenderPreferenceSetting>({
    men: false,
    woman: false,
    mix: false,
  });

  const [expanded, setExpanded] = useState(false);
  const [swapPlayer, setSwapPlayer] = useState<number | null>(null);
  const [dispRound, setDispRound] = React.useState<number>(0);

  const navigation = useNavigation();

  const resetGameRound = useCallback(() => {
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
    setDispRound(0);
  }, [setGameRounds, setPlayers]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "確認",
              "全ての組み合わせを削除しますがよろしいですか？",
              [
                {
                  text: "キャンセル",
                  style: "cancel",
                },
                {
                  text: "削除",
                  onPress: resetGameRound,
                  style: "destructive",
                },
              ]
            );
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
              fontSize: FONT_SIZE.subsubheading,
              color: Colors.link,
            }}
          >
            リセット
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, setGameRounds, setPlayers, resetGameRound]);

  const nextRestPlayer = players.filter(
    (player) => player.isJoin && player.isRest
  );

  const getPlayerName = (id: number) => {
    return players.find((player) => player.id === id)?.name;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.item}>
        <Disclosure
          isOpen={expanded}
          setIsOpen={setExpanded}
          label="詳細設定"
        />
        {expanded && (
          <>
            <View style={styles.modalContent}>
              <Text style={styles.section}>性別</Text>
              <View style={{ marginBottom: 4 }}>
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
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.section}>休憩</Text>
              <View style={{ marginBottom: 8, paddingHorizontal: 8 }}>
                <TouchableOpacity
                  style={styles.selectRestPlayerButton}
                  onPress={() =>
                    router.push({
                      pathname: "/components/MatchScreen/edit-rest-screen",
                    })
                  }
                >
                  <Text style={styles.selectRestPlayerButtonText}>
                    次回休憩にするプレイヤー選択
                  </Text>
                </TouchableOpacity>
                {nextRestPlayer.length > 0 ? (
                  <>
                    <Text style={styles.subSection}>次回休憩プレイヤー</Text>
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
            <View style={styles.modalContent}>
              <Text style={styles.section}>ペア</Text>
              <View style={{ marginBottom: 4, paddingHorizontal: 8 }}>
                <TouchableOpacity
                  style={styles.allPlayerButton}
                  onPress={() =>
                    router.push({
                      pathname: "/components/MatchScreen/pair-screen",
                    })
                  }
                >
                  <Text style={styles.addButtonText}>ペア設定</Text>
                </TouchableOpacity>
                {pairs.length > 0 ? (
                  <>
                    <Text style={styles.subSection}>ペア一覧</Text>
                    <FlatList
                      data={pairs}
                      keyExtractor={(item, index) => `${item}-${index}`}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <View style={styles.pairItem}>
                          <Text key={item.id} style={styles.restingPlayerName}>
                            {`${getPlayerName(item.player1)}・${getPlayerName(
                              item.player2
                            )}`}
                          </Text>
                        </View>
                      )}
                    />
                  </>
                ) : (
                  <Text style={styles.emptyText}>ペアはありません</Text>
                )}
              </View>
            </View>
          </>
        )}
      </View>
      <Match
        swapPlayer={swapPlayer}
        setSwapPlayer={setSwapPlayer}
        genderSetting={genderSetting}
        dispRound={dispRound}
        setDispRound={setDispRound}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    color: Colors.emptyText,
  },
  selectRestPlayerButton: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#827101",
    borderWidth: 1,
    ...globalStyles.touch,
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
  selectRestPlayerButtonText: {
    color: "#827101",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: FONT_SIZE.small,
  },
  addButtonText: {
    color: Colors.secondary,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: FONT_SIZE.small,
  },
  modalContent: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    width: "100%",
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  item: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderline,
    marginBottom: 4,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  section: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: Colors.sectionTitie,
    marginBottom: 8,
  },
  subSection: {
    fontSize: FONT_SIZE.small,
    fontWeight: 500,
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
  teams: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  team: {
    flex: 1,
    gap: 4,
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
  pairItem: {
    alignItems: "baseline",
    backgroundColor: Colors.thirdry,
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
    fontSize: FONT_SIZE.small,
    color: Colors.restPlayerName,
    marginRight: 5,
  },
});

export default MatchScreen;
