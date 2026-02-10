import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { AppContext } from "@/context/AppContext";
import { countMatch } from "@/features/match/logic/utils";
import { globalStyles } from "@/styles/global";
import GenderIcon from "@/ui/GenderIcon";
import { findPlayerTeamInMatch } from "@/utils/findPlayerTeamInMatch";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GameRound, Match as MatchType, Player } from "../../../types";

interface RestCellProps {
  swap: {
    player: number | null;
    matchId: number | null;
    partner: number | null;
    isRestPlayer: boolean;
  };
  player: Player;
}

const RestCell: React.FC<RestCellProps> = ({ swap, player }) => {
  const { players, setPlayers, gameRounds, setGameRounds, setSwap, dispRound } =
    useContext(AppContext);

  const selectRestSwap = (playerId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSwap((prev) => {
      if (prev.player === playerId) {
        return {
          player: null,
          matchId: null,
          partner: null,
          isRestPlayer: false,
        };
      }

      if (prev.player == null || prev.isRestPlayer) {
        return {
          player: playerId,
          matchId: null,
          partner: null,
          isRestPlayer: true,
        };
      }

      changePlayableRestPlayer(prev.matchId as number, prev.player, playerId);
      return {
        player: null,
        matchId: null,
        partner: null,
        isRestPlayer: false,
      };
    });
  };

  const changePlayableRestPlayer = (
    matchId: number,
    playablePlayerId: number,
    restPlayerId: number,
  ) => {
    let newGameRounds: GameRound[] = [];
    setGameRounds((prevGameRounds) => {
      const playablePlayerTeam = findPlayerTeamInMatch(
        playablePlayerId,
        prevGameRounds,
        matchId,
      );
      if (!playablePlayerTeam) {
        return prevGameRounds;
      }

      newGameRounds = prevGameRounds.map((gameRound) => {
        return {
          ...gameRound,
          matches: gameRound.matches.map((match) => {
            let updatedMatch = { ...match };

            // プレイ中プレイヤーの位置を休憩プレイヤーに置換
            if (match.id === matchId) {
              const newTeam = [...match[playablePlayerTeam.team]];
              newTeam[playablePlayerTeam.teamIdx] = restPlayerId;
              updatedMatch[playablePlayerTeam.team] = newTeam;
            }

            return updatedMatch;
          }),
        };
      });

      return newGameRounds;
    });
    const matches: MatchType[] = newGameRounds.flatMap(
      (gameRound) => gameRound.matches,
    );
    countMatch([...matches], players, setPlayers);
  };

  return (
    <TouchableOpacity
      key={player.id}
      style={[
        styles.restingPlayerItem,
        swap.player === player.id && styles.restingSwapPlayerItem,
      ]}
      onPress={() => selectRestSwap(player.id)}
      disabled={dispRound !== gameRounds.length}
    >
      <View style={styles.restingPlayerName}>
        <View style={{ flex: 4 }}>
          <Text
            style={[
              styles.restingPlayerText,
              swap.player === player.id && styles.restingSwapPlayerName,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {player.name}
          </Text>
        </View>
        {player.isRest && (
          <View style={{ flex: 1 }}>
            <Feather name="coffee" size={14} color={ColorPalette.blackText} />
          </View>
        )}
      </View>
      <View style={styles.subInfo}>
        <Text style={styles.getGameCount}>{player.matchCount}</Text>
        <Text style={styles.playerGender}>
          <GenderIcon gender={player.gender} size={18} />
        </Text>
        {dispRound === gameRounds.length && (
          <Ionicons
            name="swap-horizontal"
            size={14}
            color={ColorPalette.secondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subInfo: {
    flex: 1.7,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  getGameCount: {
    flex: 1,
    fontSize: FONT_SIZE.tiny,
  },
  team: {
    flex: 1,
    gap: 4,
  },
  playerGender: {
    flex: 1,
  },
  restingPlayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ColorPalette.restPlayerBackground,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    ...globalStyles.touch,
  },
  restingSwapPlayerItem: {
    backgroundColor: ColorPalette.thirdry,
    borderColor: ColorPalette.secondary,
  },
  restingPlayerName: {
    flex: 3,
    marginLeft: 3,
    marginRight: 3,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  restingPlayerText: {
    fontSize: FONT_SIZE.small,
    color: ColorPalette.filterItemName,
  },
  restingSwapPlayerName: {
    flex: 4,
    color: ColorPalette.blackText,
  },
});

export default RestCell;
