import ColorPalette from "@/constants/color";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Snackbar } from "react-native-paper";

interface AdCompleteSnackbarProps {
  visiable: boolean;
  message: string;
  onDismiss: () => void;
  onPressLabel: () => void;
}

const AdCompleteSnackbar: React.FC<AdCompleteSnackbarProps> = ({
  visiable,
  message,
  onDismiss,
  onPressLabel,
}) => (
  <View>
    <Snackbar
      visible={visiable}
      onDismiss={onDismiss}
      duration={10000}
      action={{
        label: "OK",
        onPress: onPressLabel,
      }}
      elevation={5}
      style={styles.snackbar}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 10,
        }}
      >
        <AntDesign name="checkcircleo" size={24} color="white" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Snackbar>
  </View>
);

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: ColorPalette.successBackground,
    shadowColor: ColorPalette.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  text: {
    color: ColorPalette.whiteText,
  },
});

export default AdCompleteSnackbar;
