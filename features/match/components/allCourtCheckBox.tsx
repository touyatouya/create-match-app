import { useAllCourtToggle } from "@/features/match/hooks/useAllCourtToggle";
import Checkbox from "@/ui/CheckBox";
import React from "react";
import { useResetSwap } from "../hooks/useResetSwap";

const AllCourtCheckBox: React.FC = () => {
  const { toggleAllCourt, isAllMatchCanInsertNext } = useAllCourtToggle();
  const { resetSwap } = useResetSwap();

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
