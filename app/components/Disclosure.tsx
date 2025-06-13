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
}

const Disclosure: React.FC<DisclosureProps> = ({ isOpen, setIsOpen }) => {
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.genderEdit}>
      <AntDesign name={isOpen ? "down" : "right"} size={20} color="black" />
      <Text style={styles.title}>詳細設定</Text>
    </TouchableOpacity>
  );
};

export default Disclosure;

const styles = StyleSheet.create({
  genderEdit: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
