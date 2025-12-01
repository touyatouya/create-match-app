import ColorPalette from "@/constants/color";
import { Gender } from "@/types";
import { Foundation } from "@expo/vector-icons";
import { View } from "react-native";

const GenderIcon: React.FC<{ gender: Gender | undefined }> = ({ gender }) => {
  if (gender === Gender.男性) {
    return (
      <View style={{ width: "100%" }}>
        <Foundation
          style={{
            paddingHorizontal: 0.7,
            alignSelf: "center",
          }}
          name="male"
          size={24}
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
          size={24}
          color={ColorPalette.women}
        />
      </View>
    );
  }
  return null;
};

export default GenderIcon;
