import ColorPalette from "@/constants/color";
import { Gender } from "@/types";
import { Foundation } from "@expo/vector-icons";
import { View } from "react-native";

interface GenderIconProps {
  gender: Gender | undefined;
  size?: number;
}

const GenderIcon: React.FC<GenderIconProps> = ({ gender, size = 24 }) => {
  if (gender === Gender.男性) {
    return (
      <View style={{ width: "100%" }}>
        <Foundation
          style={{
            paddingHorizontal: 0.7,
            alignSelf: "center",
          }}
          name="male"
          size={size}
          color={ColorPalette.men}
        />
      </View>
    );
  }
  if (gender === Gender.女性) {
    return (
      <View style={{ width: "100%" }}>
        <Foundation
          style={{
            alignSelf: "center",
          }}
          name="female"
          size={size}
          color={ColorPalette.women}
        />
      </View>
    );
  }
  return null;
};

export default GenderIcon;
