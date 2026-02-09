import ColorPalette from "@/constants/color";
import { AppContext } from "@/context/AppContext";
import {
  getOpenAppCount,
  markReviewRequersted,
  shouldShowReviewRequest,
} from "@/utils/storeReview";
import { Ionicons } from "@expo/vector-icons";
import * as StoreReview from "expo-store-review";
import React, { useContext } from "react";
import { GenerateMode, Match as MatchType } from "../../../types";
import PrimaryButton from "../PrimaryButton";
import { createMatch } from "./util";

interface CreateNewMatchButtonProps {
  dispRound: number;
  setDispRound: React.Dispatch<React.SetStateAction<number>>;
}

const CreateNewMatchButton: React.FC<CreateNewMatchButtonProps> = ({
  dispRound,
  setDispRound,
}) => {
  const {
    players,
    setPlayers,
    gameRounds,
    setGameRounds,
    generateMode,
    pairs,
    courts,
    setIsLoading,
    setNewGames,
    isAdjustMatchCount,
    isPreferMatchCountOverPair,
    genderSetting,
    setSwap,
  } = useContext(AppContext);

  const matches: MatchType[] = gameRounds.flatMap(
    (gameRound) => gameRound.matches,
  );

  const playingCourtIds = gameRounds
    .flatMap((gameRound) => gameRound.matches)
    .filter((match) => !match.canInsertNext)
    .flatMap((match) => match.courtId);

  const avaibleCourts =
    generateMode === GenerateMode.FILL_ENPTY
      ? courts.filter(
          (court) =>
            playingCourtIds == null ||
            playingCourtIds.length === 0 ||
            !playingCourtIds.includes(court.id),
        )
      : courts;

  const resetSwap = () => {
    setSwap({
      player: null,
      matchId: null,
      partner: null,
      isRestPlayer: false,
    });
  };

  return (
    <PrimaryButton
      text="新しい組み合わせを生成"
      disabled={avaibleCourts.length === 0}
      icon={
        <Ionicons name="refresh" size={24} color={ColorPalette.whiteText} />
      }
      onPress={async () => {
        setIsLoading(true);
        await setTimeout(() => {
          createMatch(
            players,
            setPlayers,
            courts,
            gameRounds,
            setGameRounds,
            pairs,
            matches,
            dispRound,
            generateMode,
            resetSwap,
            genderSetting,
            isAdjustMatchCount,
            isPreferMatchCountOverPair,
            setDispRound,
            setIsLoading,
            setNewGames,
          );
        }, 0);

        const openAppCount = await getOpenAppCount();
        const canShow = await shouldShowReviewRequest();
        if (
          matches.length >= 12 &&
          openAppCount >= 5 &&
          canShow &&
          (await StoreReview.hasAction())
        ) {
          StoreReview.requestReview();
          markReviewRequersted();
        }
      }}
      style={
        generateMode === GenerateMode.FILL_ENPTY
          ? { marginVertical: 2 }
          : undefined
      }
    />
  );
};

export default CreateNewMatchButton;
