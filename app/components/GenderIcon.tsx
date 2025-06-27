import ColorPalette from "@/constants/color";
import { Gender } from "@/types";
import { Foundation } from "@expo/vector-icons";

const GenderIcon: React.FC<{ gender: Gender | undefined }> = ({ gender }) => {
  if (gender === Gender.男性) {
    return <Foundation name="male" size={24} color={ColorPalette.men} />;
  }
  if (gender === Gender.女性) {
    return <Foundation name="female" size={24} color={ColorPalette.women} />;
  }
  return null;
};

export default GenderIcon;
