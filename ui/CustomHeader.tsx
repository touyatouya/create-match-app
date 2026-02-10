import ColorPalette from "@/constants/color";
import { FONT_SIZE } from "@/constants/fonts";
import { globalStyles } from "@/styles/global";
import { AntDesign } from "@expo/vector-icons";
import { NativeStackHeaderItemProps } from "@react-navigation/native-stack";
import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
interface CustomHeaderProps {
  title?: string;
  titleComponent?: React.ReactNode;
  isSlideScreen?: boolean;
  headerLeftText?: string;
  headerRight?: (props: NativeStackHeaderItemProps) => React.ReactNode;
  headerLeft?: (props: NativeStackHeaderItemProps) => React.ReactNode;
  disabled?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  titleComponent,
  isSlideScreen = false,
  headerLeftText,
  headerRight,
  headerLeft,
  disabled = false,
}) => {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: titleComponent ? () => titleComponent : title,
        headerLeft: isSlideScreen
          ? () => (
              <TouchableOpacity
                onPress={() => (disabled ? undefined : router.back())}
                style={[styles.headerLeft]}
              >
                <AntDesign name="left" size={20} color={ColorPalette.link} />
                <Text style={styles.headerLeftText}>{headerLeftText}</Text>
              </TouchableOpacity>
            )
          : headerLeft,
        headerRight: headerRight,
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
