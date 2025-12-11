import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
