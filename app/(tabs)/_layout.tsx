import ColorPalette from "@/constants/color";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="PlayerScreen"
        options={{
          tabBarLabel: "試合",
          tabBarIcon: ({ color }) => (
            <Ionicons name="shuffle" size={28} color={color} />
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
          tabBarLabel: "メニュー",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="dots-three-horizontal" size={26} color={color} />
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
