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
        }}
      />
    </Tabs>
  );
}
