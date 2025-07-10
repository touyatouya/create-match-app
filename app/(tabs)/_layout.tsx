import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import Loading from "../components/Loading";
import CourtIcon from "./../../assets/images/court.svg";

export default function TabsLayout() {
  const { isLoading } = useContext(AppContext);
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            ...globalStyles.touch,
          },
        }}
      >
        <Tabs.Screen
          name="MatchScreen"
          options={{
            title: "試合",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="badminton"
                size={28}
                color={color}
              />
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
          name="CourtScreen"
          options={{
            title: "コート",
            tabBarIcon: ({ color }) => (
              <CourtIcon width={28} height={28} color={color} />
            ),
          }}
        />
      </Tabs>
      {isLoading && <Loading />}
    </>
  );
}
