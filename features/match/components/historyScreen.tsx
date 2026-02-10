import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import CustomHeader from "@/ui/CustomHeader";
import Loading from "@/ui/Loading";
import MyAdmob, { BannerAdSize } from "@/ui/MyAdmob";
import analytics from "@react-native-firebase/analytics";
import React, { useContext, useEffect } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { GameRound } from "../../../types";

type SectionDataItem = GameRound;

type Section = {
  title: string;
  type: "gameRounds";
  data: SectionDataItem[];
};

const HistoryScreen: React.FC = () => {
  const { players, isLoading, courts, gameRounds } = useContext(AppContext);

  useEffect(() => {
    analytics().logEvent("screen_view", {
      screen_name: "HistoryScreen",
    });
  }, []);

  const sections: Section[] = [
    {
      title: "",
      data: gameRounds,
      type: "gameRounds",
    },
  ];

  return (
    <>
      <CustomHeader title="履歴" isSlideScreen headerLeftText="試合" />
      <View style={styles.container}>
        {gameRounds.length === 0 ? (
          <Text>試合はありません。</Text>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.title}>{index + 1}巡目</Text>
                  <View key={item.id} style={[styles.matchCard]}>
                    {item.matches.map((match) => {
                      return (
                        <View
                          key={match.id}
                          style={[
                            styles.court,
                            match.isFinished && {
                              opacity: 0.5,
                              backgroundColor: ColorPalette.finished,
                            },
                          ]}
                        >
                          <Text style={styles.courtText}>
                            {
                              courts.find((court) => court.id === match.courtId)
                                ?.number
                            }
                            コート
                          </Text>
                          <View style={styles.playerName}>
                            <Text style={styles.playerText}>
                              {match.teamA
                                .map((playerId) => {
                                  const player = players.find(
                                    (p) => p.id === playerId,
                                  );
                                  return player ? player.name : "不明な選手";
                                })
                                .join("・")}
                            </Text>
                            <Text style={styles.vsText}>vs</Text>
                            <Text style={styles.playerText}>
                              {match.teamB
                                .map((playerId) => {
                                  const player = players.find(
                                    (p) => p.id === playerId,
                                  );
                                  return player ? player.name : "不明な選手";
                                })
                                .join("・")}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
      <MyAdmob size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      {isLoading && <Loading />}
    </>
  );
};

const styles = StyleSheet.create({
  matchCard: {
    backgroundColor: ColorPalette.background,
    borderRadius: 8,
    padding: 8,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  court: {
    flexDirection: "row",
    gap: 8,
    borderRadius: 4,
  },
  courtText: { fontWeight: "bold", width: 60 },
  vsText: { width: 42, textAlign: "center" },
  playerName: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  playerText: {
    width: 120,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default HistoryScreen;
