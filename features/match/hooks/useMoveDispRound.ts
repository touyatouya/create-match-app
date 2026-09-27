import { AppContext } from "@/context/AppContext";
import { useContext } from "react";

export const useMoveDispRound = () => {
  const { dispRound, setDispRound, gameRounds } = useContext(AppContext);

  const moveDispRound = (direction: "next" | "prev") => {
    if (direction === "next") {
      if (dispRound < gameRounds.length) {
        setDispRound(dispRound + 1);
      }
    } else {
      if (dispRound > 0) {
        setDispRound(dispRound - 1);
      }
    }
  };

  return { moveDispRound };
};
