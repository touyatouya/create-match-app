import { AppContext } from "@/context/AppContext";
import { Player } from "@/types";
import { savePlayerInfo } from "@/utils/saveStorage";
import { useContext, useRef } from "react";
import { LayoutAnimation } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import ListEmptyText from "../ListEmptyText";
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
  const { players, setPlayers, pairs, setPairs } = useContext(AppContext);

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
        (pair) => pair.player1 !== id && pair.player2 !== id
      );
      setPairs(updatePairs);
    }

    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, isJoin: !player.isJoin } : player
    );
    setPlayers(updatedPlayers);
  };

  const removePlayer = (id: number): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newPlayers = players.filter((player) => player.id !== id);
    setPlayers(newPlayers);
    savePlayerInfo(
      newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
          gender: player.gender,
          rank: player.rank,
        };
      })
    );
  };

  return (
    <DraggableFlatList
      onContentSizeChange={handleContentSizeChange}
      ref={flatListRef}
      data={filteredPlayers}
      onDragEnd={({ data }) => {
        setPlayers(data);
        // setDefaultOrderPlayers(data);
        savePlayerInfo(
          data.map((player) => {
            return {
              id: player.id,
              name: player.name,
              gender: player.gender,
              rank: player.rank,
            };
          })
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
        <ListEmptyText
          message={"プレイヤーがいません。\n 右上の＋から追加してください。"}
        />
      }
    />
  );
};

export default PlayerTable;
