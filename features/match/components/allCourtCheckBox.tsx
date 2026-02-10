import { AppContext } from "@/context/AppContext";
import Checkbox from "@/ui/CheckBox";
import React, { useContext } from "react";

interface AllCourtCheckBoxProps {
  resetSwap: () => void;
}

const AllCourtCheckBox: React.FC<AllCourtCheckBoxProps> = ({ resetSwap }) => {
  const { gameRounds, setGameRounds } = useContext(AppContext);

  const isAllMatchCanInsertNext = gameRounds.every((gameRound) =>
    gameRound.matches.every((match) => match.canInsertNext),
  );

  const setAllMatchCanInsertNext = (isAllMatchCanInsertNext: boolean) => {
    setGameRounds((prev) => {
      return prev.map((gameRound) => {
        const newMatches = gameRound.matches.map((match) => {
          if (!match.isFinished) {
            return {
              ...match,
              canInsertNext: !isAllMatchCanInsertNext,
            };
          }
          return match;
        });
        return { ...gameRound, matches: newMatches };
      });
    });
  };

  return (
    <Checkbox
      onChange={() => {
        setAllMatchCanInsertNext(isAllMatchCanInsertNext);
        resetSwap();
      }}
      label="全コート終了"
      checked={isAllMatchCanInsertNext}
    />
  );
};

export default AllCourtCheckBox;
