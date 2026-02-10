import { AppContext } from "@/context/AppContext";
import { Player } from "@/types";
import ListEmptyText from "@/ui/ListEmptyText";
import { savePlayerInfo } from "@/utils/saveStorage";
import { useContext, useRef } from "react";
import { LayoutAnimation, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import PlayerRow from "./playerRow";

interface PlayerTableProps {
  filteredPlayers: Player[];
  isEdit: boolean;
  isAddingRef: React.RefObject<boolean>;
}
const PlayerTable: React.FC<PlayerTableProps> = ({
  filteredPlayers,
  isEdit,
  isAddingRef,
}) => {
  const { players, setPlayers, pairs, setPairs, isAdjustMatchCount } =
    useContext(AppContext);

  const flatListRef = useRef<any>(null);

  const handleContentSizeChange = () => {
    if (isAddingRef.current) {
      flatListRef.current?.scrollToEnd({ animated: true });
      isAddingRef.current = false;
    }
  };

  const joinPlayer = (id: number): void => {
    const targetPlayer = players.find((player) => player.id === id);

    if (targetPlayer?.isJoin) {
      const updatePairs = pairs.filter(
        (pair) => pair.player1 !== id && pair.player2 !== id,
      );
      setPairs(updatePairs);
    }

    setPlayers((prev) => {
      return prev.map((p) => {
        if (p.id === id) {
          const otherMatchCounts = prev
            .filter((pl) => pl.isJoin && pl.id !== id)
            .map((pl) => pl.matchCount);
          const minMatchCount =
            otherMatchCounts.length > 0
              ? Math.min(...otherMatchCounts)
              : p.matchCount;

          return {
            ...p,
            isJoin: !p.isJoin,
            matchCount: isAdjustMatchCount ? minMatchCount : p.matchCount,
          };
        } else {
          return p;
        }
      });
    });
  };

  const removePlayer = (id: number): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newPlayers = players.filter((player) => player.id !== id);
    setPlayers(newPlayers);
    savePlayerInfo(
      newPlayers
        .filter((p) => !p.isAnonymous)
        .map((player) => {
          return {
            id: player.id,
            name: player.name,
            gender: player.gender,
            rank: player.rank,
          };
        }),
    );
  };

  return (
    <DraggableFlatList
      onContentSizeChange={handleContentSizeChange}
      ref={flatListRef}
      data={filteredPlayers}
      onDragEnd={({ data }) => {
        setPlayers(data);
        savePlayerInfo(
          data
            .filter((p) => !p.isAnonymous)
            .map((player) => {
              return {
                id: player.id,
                name: player.name,
                gender: player.gender,
                rank: player.rank,
              };
            }),
        );
      }}
      renderItem={({ item, drag }) => (
        <PlayerRow
          item={item}
          drag={drag}
          isEdit={isEdit}
          removePlayer={removePlayer}
          joinPlayer={joinPlayer}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <ListEmptyText message={"右下の＋からプレイヤーを追加してください"} />
      }
      ListFooterComponent={<View style={{ height: 90 }}></View>}
    />
  );
};

export default PlayerTable;
