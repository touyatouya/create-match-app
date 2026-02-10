import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

export const useResetSwap = () => {
  const { setSwap } = useContext(AppContext);
  const resetSwap = () => {
    setSwap({
      player: null,
      matchId: null,
      partner: null,
      isRestPlayer: false,
    });
  };
  return { resetSwap };
};
