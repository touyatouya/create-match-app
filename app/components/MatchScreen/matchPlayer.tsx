import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { GameRound, GenerateMode, Match } from "@/types";
import { findPlayerTeamInMatch } from "@/utils/findPlayerTeamInMatch";
import { Ionicons } from "@expo/vector-icons";
import analytics from "@react-native-firebase/analytics";
import React from "react";
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { default as PlayerInfo } from "./playerInfo";
import { countMatch } from "./util";

interface MatchPlayerProps {
  matchId: number;
  swapPlayer: number | null;
  playerId: number;
  partnerId: number;
  isSwap: boolean;
  showMatchCount: boolean;
  isFinished: boolean;
}

const MatchPlayer: React.FC<MatchPlayerProps> = ({
  matchId,
  swapPlayer,
  playerId,
  partnerId,
  isSwap,
  showMatchCount,
  isFinished,
}) => {
  const { generateMode, setGameRounds, players, setPlayers, setSwap } =
    React.useContext(AppContext);

  const changePlayer = (
    targetMatchId: number,
    targetPlayerId: number,
    selectedMatchId: number,
    selectedPlayerId: number,
  ) => {
    setGameRounds((prevGameRounds) => {
      const targetTeam = findPlayerTeamInMatch(
        targetPlayerId,
        prevGameRounds,
        targetMatchId,
      );
      const selectedTeam = findPlayerTeamInMatch(
        selectedPlayerId,
        prevGameRounds,
        selectedMatchId,
      );

      if (!targetTeam || !selectedTeam) return prevGameRounds;

      return prevGameRounds.map((gr) => {
        return {
          ...gr,
          matches: gr.matches.map((m) => {
            let updatedMatch = { ...m };

            // プレイヤーAの位置をプレイヤーBに置換
            if (m.id === targetMatchId) {
              const newTeam = [...m[targetTeam.team]];
              newTeam[targetTeam.teamIdx] = selectedPlayerId;
              updatedMatch[targetTeam.team] = newTeam;
            }

            // プレイヤーBの位置をプレイヤーAに置換
            if (m.id === selectedMatchId) {
              const newTeam = [...m[selectedTeam.team]];
              newTeam[selectedTeam.teamIdx] = targetPlayerId;
              updatedMatch[selectedTeam.team] = newTeam;
            }

            return updatedMatch;
          }),
        };
      });
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
    const matches: Match[] = newGameRounds.flatMap(
      (gameRound) => gameRound.matches,
    );
    countMatch([...matches], players, setPlayers);
  };

  const selectSwapPlayer = (
    matchId: number,
    playerId: number,
    partnerId: number,
  ) => {
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

      if (prev.player == null || prev.partner === playerId) {
        return {
          player: playerId,
          matchId,
          partner: partnerId,
          isRestPlayer: false,
        };
      }

      if (prev.isRestPlayer) {
        changePlayableRestPlayer(matchId, playerId, prev.player);
      } else {
        changePlayer(matchId, playerId, prev.matchId as number, prev.player);
      }

      return {
        player: null,
        matchId: null,
        partner: null,
        isRestPlayer: false,
      };
    });
  };

  return (
    <>
      {isSwap ? (
        <TouchableOpacity
          key={playerId}
          style={[
            styles.playerButton,
            swapPlayer === playerId && styles.swapPlayerButton,
          ]}
          onPress={async () => {
            !isFinished && selectSwapPlayer(matchId, playerId, partnerId);

            await analytics().logEvent("swap_player");
          }}
        >
          <PlayerInfo playerId={playerId} showMatchCount={showMatchCount} />
          <Ionicons
            name="swap-horizontal"
            size={14}
            color={ColorPalette.secondary}
          />
        </TouchableOpacity>
      ) : (
        <View
          key={playerId}
          style={[
            styles.playerButton,
            generateMode === GenerateMode.FILL_ENPTY &&
              isFinished && { opacity: 0.5 },
          ]}
        >
          <PlayerInfo playerId={playerId} showMatchCount={showMatchCount} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  playerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ColorPalette.background,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ColorPalette.borderline,
    ...globalStyles.touch,
  },
  swapPlayerButton: {
    backgroundColor: ColorPalette.thirdry,
    borderColor: ColorPalette.secondary,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});

export default MatchPlayer;
