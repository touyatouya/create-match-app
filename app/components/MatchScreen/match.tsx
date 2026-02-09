import { AppContext } from "@/context/AppContext";
import { chunkArray } from "@/utils/chunkArray";
import { generateUniqId } from "@/utils/createId";
import React, { useContext, useEffect } from "react";
import { SectionList, View } from "react-native";
import { GenerateMode, Match as MatchType, Player } from "../../../types";
import CreateNewMatchButton from "./createNewMatchButton";
import FillEmptyMatchHeader from "./fillEmptyMatchHeader";
import RenderMatch from "./renderMatch";
import ReplaceAllMatchHeader from "./replaceAllMatchHeader";
import RestHeader from "./restHeader";
import RestRow from "./restRow";

type SectionDataItem = MatchType | MatchType[] | Player | Player[]; // Player[] は休憩中プレイヤー行用

type Section = {
  title: string;
  type: "match" | "rest" | "matchHistory";
  data: SectionDataItem[];
};

interface MatchProps {
  dispRound: number;
  setDispRound: React.Dispatch<React.SetStateAction<number>>;
  setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Match: React.FC<MatchProps> = ({
  dispRound,
  setDispRound,
  setSnackbarVisible,
}) => {
  const { players, gameRounds, generateMode, courts, setIsLoading, setSwap } =
    useContext(AppContext);

  const matches: MatchType[] = gameRounds.flatMap(
    (gameRound) => gameRound.matches,
  );

  const playablePlayers = players.filter((player) => {
    if (generateMode === GenerateMode.REPLACE_ALL) {
      return gameRounds[dispRound - 1]?.matches.some((match) => {
        return (
          match.teamA.some((playerId) => playerId === player.id) ||
          match.teamB.some((playerId) => playerId === player.id)
        );
      });
    } else {
      return gameRounds
        .flatMap((gameRound) => gameRound.matches)
        .filter((match) => !match.isFinished || !match.canInsertNext)
        .some((match) => {
          return (
            match.teamA.some((playerId) => playerId === player.id) ||
            match.teamB.some((playerId) => playerId === player.id)
          );
        });
    }
  });

  const playablePlayerIds = new Set(playablePlayers.map((p) => p.id));

  const restPlayers = players.filter(
    (player) => player.isJoin && !playablePlayerIds.has(player.id),
  );

  const restRows = chunkArray(restPlayers, 2);

  const matchListWithPlaceholders: MatchType[] = (() => {
    if (generateMode === GenerateMode.REPLACE_ALL) return [];
    const active = matches.filter((m) => !m.isFinished);
    const sortedCourts = courts.slice().sort((a, b) => a.number - b.number);
    return sortedCourts.map((court) => {
      const m = active.find((am) => am.courtId === court.id);
      if (m == null) {
        return {
          id: generateUniqId(matches.map((m) => m.id)),
          courtId: court.id,
          teamA: [],
          teamB: [],
          isFinished: false,
          canInsertNext: true,
          finishRound: null,
        };
      }
      return m;
    });
  })();

  const sections: Section[] = [
    {
      title: "",
      data:
        generateMode === GenerateMode.REPLACE_ALL
          ? gameRounds[dispRound - 1]?.matches
          : matchListWithPlaceholders,
      type: "match",
    },
    {
      title: "休憩中のプレイヤー",
      data: restRows,
      type: "rest",
    },
  ];

  const resetSwap = () => {
    setSwap({
      player: null,
      matchId: null,
      partner: null,
      isRestPlayer: false,
    });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [gameRounds, setIsLoading]);

  return (
    <View style={{ flex: 1 }}>
      {generateMode === GenerateMode.REPLACE_ALL && (
        <CreateNewMatchButton
          dispRound={dispRound}
          setDispRound={setDispRound}
        />
      )}
      <FillEmptyMatchHeader resetSwap={resetSwap} />
      <ReplaceAllMatchHeader
        dispRound={dispRound}
        setDispRound={setDispRound}
      />
      {(gameRounds[dispRound - 1] != null ||
        generateMode === GenerateMode.FILL_ENPTY) && (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) =>
            Array.isArray(item)
              ? `restRow-${index}`
              : (("id" in item) as unknown as Player | MatchType)
                ? `${item.id}-${index}`
                : `${index}`
          }
          renderItem={({ item, section }) => {
            if (section.type === "match") {
              const match = item as MatchType;
              const court = courts.find((court) => court.id === match.courtId);
              const courtId = court?.id as number;
              const courtNumber = court?.number as number;

              return (
                <RenderMatch
                  item={match}
                  courtId={courtId}
                  courtNumber={courtNumber}
                  showMatchCount={true}
                  canCheck={generateMode === GenerateMode.FILL_ENPTY}
                  canDelete={true}
                  canSwap={true}
                  dispRound={dispRound}
                />
              );
            } else if (section.type === "rest") {
              const restRow = item as Player[];
              return <RestRow item={restRow} dispRound={dispRound} />;
            }
            return null;
          }}
          renderSectionHeader={({ section }) => {
            if (section.type === "match") {
              return null;
            } else if (section.type === "rest") {
              return <RestHeader dispRound={dispRound} />;
            }
            return null;
          }}
        />
      )}
      {generateMode === GenerateMode.FILL_ENPTY && (
        <CreateNewMatchButton
          dispRound={dispRound}
          setDispRound={setDispRound}
        />
      )}
    </View>
  );
};

export default Match;
