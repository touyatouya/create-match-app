import ColorPalette from "@/constants/color";
import { globalStyles } from "@/styles/global";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

interface RemoveButtonProps {
  onPress: () => void;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      {
        ...globalStyles.touch,
        justifyContent: "center",
        alignItems: "center",
      },
    ]}
  >
    <AntDesign name="minuscircle" size={24} color={ColorPalette.error} />
  </TouchableOpacity>
);

export default RemoveButton;
