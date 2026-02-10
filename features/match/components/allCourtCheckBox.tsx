import { useAllCourtToggle } from "@/features/match/hooks/useAllCourtToggle";
import Checkbox from "@/ui/CheckBox";
import React from "react";

interface AllCourtCheckBoxProps {
  resetSwap: () => void;
}

const AllCourtCheckBox: React.FC<AllCourtCheckBoxProps> = ({ resetSwap }) => {
  const { toggleAllCourt, isAllMatchCanInsertNext } = useAllCourtToggle();

  return (
    <Checkbox
      onChange={() => {
        toggleAllCourt();
        resetSwap();
      }}
      label="全コート終了"
      checked={isAllMatchCanInsertNext}
    />
  );
};

export default AllCourtCheckBox;
