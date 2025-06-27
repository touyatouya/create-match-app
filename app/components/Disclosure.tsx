import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { AntDesign } from "@expo/vector-icons";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface DisclosureProps {
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  label: string;
}

const Disclosure: React.FC<DisclosureProps> = ({
  isOpen,
  setIsOpen,
  label,
}) => {
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.genderEdit}>
      <AntDesign
        name={isOpen ? "down" : "right"}
        size={20}
        color={ColorPalette.normalIcon}
      />
      <Text style={styles.title}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Disclosure;

const styles = StyleSheet.create({
  genderEdit: {
    flexDirection: "row",
    alignItems: "center",
    ...globalStyles.touch,
  },
  title: {
    fontSize: FONT_SIZE.subsubheading,
    fontWeight: "bold",
    color: ColorPalette.blackText,
  },
});
