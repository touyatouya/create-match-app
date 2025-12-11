import ColorPalette from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="PlayerScreen"
        options={{
          tabBarLabel: "試合",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shuffle" size={size} color={color} />
          ),
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0.5,
            borderTopColor: ColorPalette.pageHeaderFooterBorder,
          },
        }}
      />
      <Tabs.Screen
        name="SettingScreen"
        options={{
          tabBarLabel: "設定",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0.5,
            borderTopColor: ColorPalette.pageHeaderFooterBorder,
          },
        }}
      />
    </Tabs>
  );
}
