import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { AntDesign } from "@expo/vector-icons";
import {
  NativeStackHeaderLeftProps,
  NativeStackHeaderRightProps,
} from "@react-navigation/native-stack";
import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
interface CustomHeaderProps {
  title: string;
  isSlideScreen?: boolean;
  headerLeftText?: string;
  headerRight?: (props: NativeStackHeaderRightProps) => React.ReactNode;
  headerLeft?: (props: NativeStackHeaderLeftProps) => React.ReactNode;
  disalbed?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  isSlideScreen = false,
  headerLeftText,
  headerRight,
  headerLeft,
  disalbed = false,
}) => {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title: title,
        headerLeft: !disalbed
          ? isSlideScreen
            ? () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={[styles.headerLeft, { marginLeft: -8 }]}
                >
                  <AntDesign name="left" size={24} color={ColorPalette.link} />
                  <Text style={styles.headerLeftText}>{headerLeftText}</Text>
                </TouchableOpacity>
              )
            : headerLeft
          : undefined,
        headerRight: !disalbed ? headerRight : undefined,
      }}
    />
  );
};

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
  headerLeft: {
    ...globalStyles.touch,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerLeftText: {
    marginLeft: 6,
    fontSize: FONT_SIZE.body,
    color: ColorPalette.link,
  },
});

export default CustomHeader;
