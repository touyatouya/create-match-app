import Colors from "@/constants/color";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import CoatIcon from "./../../assets/images/coat.svg";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.whiteText, // アクティブ時の色（青）
        tabBarInactiveTintColor: Colors.muted, // 非アクティブ時の色（グレー）
        tabBarStyle: {
          backgroundColor: Colors.primary, // フッターの背景色
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.whiteText,
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
