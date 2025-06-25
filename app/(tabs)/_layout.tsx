import { AppContext } from "@/context/AppContext";
import { globalStyles } from "@/styles/global";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import CoatIcon from "./../../assets/images/coat.svg";

export default function TabsLayout() {
  const { isLoading } = useContext(AppContext);
  return (
    <>
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: Colors.whiteText, // アクティブ時の色（青）
          // tabBarInactiveTintColor: Colors.muted, // 非アクティブ時の色（グレー）
          tabBarStyle: {
            // backgroundColor: Colors.primary, // フッターの背景色
            ...globalStyles.touch,
          },
          // headerStyle: {
          //   backgroundColor: Colors.primary,
          // },
          // headerTintColor: Colors.whiteText,
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
              <MaterialCommunityIcons
                name="badminton"
                size={28}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      {isLoading && (
        <View style={styles.overlay} pointerEvents="auto">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0,0,0,0.2)", // 薄暗くする
    justifyContent: "center",
    alignItems: "center",
  },
});
