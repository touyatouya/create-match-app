import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import CoatIcon from "./../../assets/images/coat.svg";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="CoatScreen"
        options={{
          title: "コート",
          tabBarIcon: () => <CoatIcon width={28} height={28} />,
        }}
      />
      <Tabs.Screen
        name="PlayerScreen"
        options={{
          title: "プレイヤー",
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="human-handsdown"
              size={28}
              color="black"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MatchScreen/index"
        options={{
          title: "試合",
          tabBarIcon: () => (
            <MaterialCommunityIcons name="badminton" size={28} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="MatchScreen/Match"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="MatchScreen/match"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="MatchScreen/util"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
