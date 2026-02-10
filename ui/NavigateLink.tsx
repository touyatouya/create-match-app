import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface NavigateLinkType {
  onPress: () => void;
  text: string;
}

const NavigateLink: React.FC<NavigateLinkType> = ({ onPress, text }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.link}>
      <Text style={styles.linkText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    alignItems: "flex-end",
    marginBottom: 8,
    justifyContent: "center",
    ...globalStyles.touch,
  },
  linkText: {
    color: ColorPalette.link,
    fontSize: FONT_SIZE.body,
  },
});

export default NavigateLink;
