import { AppContext } from "@/context/AppContext";
import { chunkArray } from "@/utils/chunkArray";
import React, { useContext } from "react";
import { SectionList } from "react-native";
import { GenerateMode, Match as MatchType, Player } from "../../../types";
import { fillMatch } from "../logic/fillMatch";
import { flatGrToM } from "../logic/flatGrToM";
import { getPlayingPlayers } from "../logic/getPlayingPlayers";
import { getRestingPlayers } from "../logic/getRestingPlayers";
import RenderMatch from "./renderMatch";
import RestHeader from "./restHeader";
import RestRow from "./restRow";

type SectionDataItem = MatchType | MatchType[] | Player | Player[]; // Player[] は休憩中プレイヤー行用

type Section = {
  title: string;
  type: "match" | "rest" | "matchHistory";
  data: SectionDataItem[];
};

const Matchup: React.FC = () => {
  const { players, gameRounds, generateMode, courts, dispRound } =
    useContext(AppContext);

  if (
    gameRounds[dispRound - 1] == null &&
    generateMode === GenerateMode.REPLACE_ALL
  ) {
    return null;
  }

  const matches: MatchType[] = flatGrToM(gameRounds);
  const matchListWithPlaceholders: MatchType[] = fillMatch(matches, courts);

  const playingPlayers = getPlayingPlayers(
    players,
    gameRounds,
    generateMode,
    dispRound,
  );
  const restPlayers = getRestingPlayers(players, playingPlayers);
  const restRows = chunkArray(restPlayers, 2);

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

  return (
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
              canCheck={generateMode === GenerateMode.FILL_EMPTY}
              canDelete={true}
              canSwap={true}
            />
          );
        } else if (section.type === "rest") {
          const restRow = item as Player[];
          return <RestRow item={restRow} />;
        }
        return null;
      }}
      renderSectionHeader={({ section }) => {
        if (section.type === "match") {
          return null;
        } else if (section.type === "rest") {
          return <RestHeader />;
        }
        return null;
      }}
    />
  );
};

export default Matchup;
