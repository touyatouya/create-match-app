import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import CoatIcon from "./../../assets/images/coat.svg";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF", // アクティブ時の色（青）
        tabBarInactiveTintColor: "#888", // 非アクティブ時の色（グレー）
      }}
    >
      <Tabs.Screen
        name="CoatScreen"
        options={{
          title: "コート",
          tabBarIcon: ({ color }) => (
            <CoatIcon width={28} height={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="PlayerScreen"
        options={{
          title: "プレイヤー",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MatchScreen"
        options={{
          title: "試合",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="badminton" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
