import { AppContext } from "@/context/AppContext";
import { attachMatchOffset } from "@/shared/logic/attachMatchOffset";
import { Player } from "@/types";
import { useContext } from "react";
import { generateNewPlayer } from "../logic/generateNewPlayer";

export const useAddPlayer = () => {
  const { players, setPlayers, isAdjustMatchCount, gameRounds } =
    useContext(AppContext);

  const addPlayer = (isAnonymous: boolean, name: Player["name"]) => {
    let newPlayer = generateNewPlayer(players, isAnonymous, name);

    if (isAdjustMatchCount) {
      newPlayer = attachMatchOffset(newPlayer, gameRounds, players);
    }

    const result = [...players, newPlayer];
    setPlayers(result);
    return result;
  };

  return { addPlayer };
};
