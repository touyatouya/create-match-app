import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pair-screen"
          options={{
            title: "ペア作成",
            headerShown: true,
          }}
        />
      </Stack>
    </AppProvider>
  );
}
