import { AppContext } from "@/context/AppContext";
import { GameRound, Match, Player } from "@/types";
import { useContext } from "react";
import { LayoutAnimation } from "react-native";
import { findPlayerTeamInMatch } from "../logic/findPlayerTeamInMatch";
import { replacePlayerInMatch } from "../logic/replacePlayerInMatch";
import { useResetSwap } from "./useResetSwap";

export const useSwapPlayer = () => {
  const { gameRounds, setGameRounds, swap, setSwap } = useContext(AppContext);

  const changePlayer = (
    targetMatchId: Match["id"],
    targetPlayerId: Player["id"],
    selectedMatchId: Match["id"],
    selectedPlayerId: Player["id"],
  ) => {
    const targetTeam = findPlayerTeamInMatch(
      targetPlayerId,
      gameRounds,
      targetMatchId,
    );
    const selectedTeam = findPlayerTeamInMatch(
      selectedPlayerId,
      gameRounds,
      selectedMatchId,
    );

    if (!targetTeam || !selectedTeam) return;

    const newGameRounds: GameRound[] = gameRounds.map((gr) => {
      return {
        ...gr,
        matches: gr.matches.map((m) => {
          const updatedMatch1 = replacePlayerInMatch(
            m,
            targetMatchId,
            selectedPlayerId,
            targetTeam.team,
            targetTeam.teamIdx,
          );

          if (updatedMatch1 != null) return updatedMatch1;

          const updatedMatch2 = replacePlayerInMatch(
            m,
            selectedMatchId,
            targetPlayerId,
            selectedTeam.team,
            selectedTeam.teamIdx,
          );

          if (updatedMatch2 != null) return updatedMatch2;
          return m;
        }),
      };
    });
    setGameRounds(newGameRounds);
  };

  const changePlayableRestPlayer = (
    matchId: Match["id"],
    playablePlayerId: Player["id"],
    restPlayerId: Player["id"],
  ) => {
    const playablePlayerTeam = findPlayerTeamInMatch(
      playablePlayerId,
      gameRounds,
      matchId,
    );
    if (playablePlayerTeam == null) return;

    const newGameRounds = gameRounds.map((gameRound) => {
      return {
        ...gameRound,
        matches: gameRound.matches.map((match) => {
          const updatedMatch = replacePlayerInMatch(
            match,
            matchId,
            restPlayerId,
            playablePlayerTeam.team,
            playablePlayerTeam.teamIdx,
          );
          if (updatedMatch != null) return updatedMatch;
          return match;
        }),
      };
    });

    setGameRounds(newGameRounds);
  };

  const { resetSwap } = useResetSwap();

  const selectSwapPlayer = (
    matchId: Match["id"],
    playerId: Player["id"],
    partnerId: Player["id"],
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (swap.player === playerId) {
      resetSwap();
      return;
    }

    if (swap.player == null || swap.partner === playerId) {
      setSwap({
        player: playerId,
        matchId,
        partner: partnerId,
        isRestPlayer: false,
      });
      return;
    }

    if (swap.isRestPlayer) {
      changePlayableRestPlayer(matchId, playerId, swap.player);
    } else {
      changePlayer(matchId, playerId, swap.matchId as number, swap.player);
    }
    resetSwap();
  };

  const selectRestSwap = (playerId: Player["id"]) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (swap.player === playerId) {
      resetSwap();
      return;
    }

    if (swap.player == null || swap.isRestPlayer) {
      setSwap({
        player: playerId,
        matchId: null,
        partner: null,
        isRestPlayer: true,
      });
      return;
    }

    changePlayableRestPlayer(swap.matchId as number, swap.player, playerId);
    resetSwap();
  };
  return { selectSwapPlayer, selectRestSwap };
};
