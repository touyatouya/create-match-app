import { AntDesign } from "@expo/vector-icons";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

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
        color={Colors.normalIcon}
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
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.sectionTitie,
  },
});
