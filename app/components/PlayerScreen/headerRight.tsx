import { globalStyles } from "@/styles/global";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface HeaderRightProps {
  text: string;
  onPress: () => void;
}
const HeaderRight: React.FC<HeaderRightProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[globalStyles.headerRight, styles.headerRight]}
    >
      <Text style={globalStyles.headerText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerRight: { marginRight: -8 },
});

export default HeaderRight;
