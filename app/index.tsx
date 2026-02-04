import { SESSION_MILLISECONDS, STORAGE_KEYS } from "@/constants/storage";
import { AppContext } from "@/context/AppContext";
import { Court, GameRound, Pair, Player } from "@/types";
import { isVersionNewer } from "@/utils/isVersionNewer";
import { clearGameData } from "@/utils/saveStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import Constants from "expo-constants";
import { Redirect } from "expo-router";
import { useContext, useEffect } from "react";
import { Alert, Linking } from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

export default function Index() {
  const {
    setGameRounds,
    setCourts,
    setPairs,
    setPlayers,
    setGenderSetting,
    setGenerateMode,
    setAnonymousPlayerCount,
    setIsRestore,
    setIsAdjustMatchCount,
    setIsPreferMatchCountOverPair,
  } = useContext(AppContext);
  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const data = await firestore()
          .collection("app_config")
          .doc("version")
          .get()
          .then((doc: FirebaseFirestoreTypes.DocumentSnapshot) => doc.data());
        if (!data) return;
        const latest = data.latest_version;
        const url = data.store_url_ios;
        const current = Constants.expoConfig?.version; // アプリ側
        if (!latest || !current) return;
        if (isVersionNewer(latest, current)) {
          // 更新が必要
          Alert.alert(
            "アップデートがあります",
            "新しいバージョンが利用できます",
            [
              {
                text: "アップデート",
                onPress: () => {
                  Linking.openURL(url);
                },
              },
              { text: "閉じる", style: "cancel" },
            ],
          );
        }
      } catch (e) {
        console.log("version check error:", e);
      }
    };
    checkAppVersion();

    const loadData = async () => {
      const gameData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_DATA);
      let gameDataLength: number = 0;
      if (gameData) gameDataLength = JSON.parse(gameData).length;
      if (gameData == null || gameDataLength <= 0) {
        setIsRestore(false);
        return;
      }
      const parsedGameData = JSON.parse(gameData);
      const saveAt = parsedGameData.saveAt;
      if (saveAt) {
        const now = new Date().getTime();
        if (now - saveAt > SESSION_MILLISECONDS) {
          // セッション切れ
          clearGameData();
          setIsRestore(false);
          return;
        }
      }

      // 組み合わせ
      const parsedGameRounds = parsedGameData.gameRounds;
      if (parsedGameRounds == null) {
        setIsRestore(false);
        return;
      }
      let gameRounds: GameRound[] = [];
      for (let i = 0; i < parsedGameRounds.length; i++) {
        gameRounds.push({
          id: parsedGameRounds[i].id,
          matches: parsedGameRounds[i].matches,
        });
      }
      setGameRounds(gameRounds);

      // プレイヤー
      const parsedRecentPlayers = parsedGameData.recentPlayers;
      if (parsedRecentPlayers == null) {
        setIsRestore(false);
        return;
      }
      let players: Player[] = [];
      for (let i = 0; i < parsedRecentPlayers.length; i++) {
        players.push({
          id: parsedRecentPlayers[i].id,
          name: parsedRecentPlayers[i].name,
          gender: parsedRecentPlayers[i].gender,
          matchCount: parsedRecentPlayers[i].matchCount,
          isRest: parsedRecentPlayers[i].isRest,
          isJoin: parsedRecentPlayers[i].isJoin,
          rank: parsedRecentPlayers[i].rank,
          isAnonymous: parsedRecentPlayers[i].isAnonymous,
          anonymousNumber: parsedRecentPlayers[i].anonymousNumber,
        });
      }
      setPlayers(players);

      // コート
      const parsedCourts = parsedGameData.courts;
      if (parsedCourts == null) {
        setIsRestore(false);
        return;
      }
      let courts: Court[] = [];
      for (let i = 0; i < parsedCourts.length; i++) {
        courts.push({
          id: parsedCourts[i].id,
          number: parsedCourts[i].number,
        });
      }
      setCourts(courts);

      // 作成方式
      const parsedGenerateMode = parsedGameData.generateMode;
      if (parsedGenerateMode == null) {
        setIsRestore(false);
        return;
      }
      setGenerateMode(parsedGenerateMode);

      setIsRestore(true);

      // 匿名参加者数
      const parsedAnonymousPlayerCount = parsedGameData.anonymousPlayerCount;
      if (parsedAnonymousPlayerCount != null) {
        setAnonymousPlayerCount(parsedAnonymousPlayerCount);
      }

      // ペア
      const parsedPairs = parsedGameData.pairs;
      if (parsedPairs != null) {
        let pairs: Pair[] = [];
        for (let i = 0; i < parsedPairs.length; i++) {
          pairs.push({
            id: parsedPairs[i].id,
            player1: parsedPairs[i].player1,
            player2: parsedPairs[i].player2,
          });
        }
        setPairs(pairs);
      }

      // ペアより試合数優先
      const parsedIsPreferMatchCountOverPair =
        parsedGameData.isPreferMatchCountOverPair;
      if (parsedIsPreferMatchCountOverPair != null) {
        setIsPreferMatchCountOverPair(parsedIsPreferMatchCountOverPair);
      }

      // 性別設定
      const parsedGenderSetting = parsedGameData.genderSetting;
      if (parsedGenderSetting != null) {
        setGenderSetting(parsedGenderSetting);
      }
    };
    loadData();

    const loadIsAdjustMatchCount = async () => {
      const isAdjustMatchCount = await AsyncStorage.getItem(
        STORAGE_KEYS.IS_ADJUST_MATCH_COUNT,
      );
      if (isAdjustMatchCount != null) {
        setIsAdjustMatchCount(JSON.parse(isAdjustMatchCount));
      }
    };
    loadIsAdjustMatchCount();
  }, [
    setAnonymousPlayerCount,
    setCourts,
    setGameRounds,
    setGenerateMode,
    setPairs,
    setPlayers,
    setGenderSetting,
    setIsRestore,
    setIsPreferMatchCountOverPair,
    setIsAdjustMatchCount,
  ]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Redirect href="/(tabs)/PlayerScreen" />
    </SafeAreaProvider>
  );
}
