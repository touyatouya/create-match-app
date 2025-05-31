import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="CoatScreen" options={{ title: "コート" }} />
      <Tabs.Screen name="PlayerScreen" options={{ title: "プレイヤー" }} />
      <Tabs.Screen name="MatchScreen" options={{ title: "試合" }} />
    </Tabs>
  );
}
