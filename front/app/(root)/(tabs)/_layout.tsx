import React from "react";
import { Image, View, Text } from "react-native";
import { icons } from "../../../constants/index";
import { Tabs } from "expo-router";

const tabsConfig = [
  { name: "chat", title: "Chat", icon: icons.messages, label: "Chat" },
  { name: "home", title: "Home", icon: icons.home, label: "Home" },
  { name: "pets", title: "Pets", icon: icons.pet, label: "Pet" },
  { name: "profile", title: "Profile", icon: icons.profile, label: "Account" },
];

const TabIcon = ({ source, label, focused } :  {
  source:any;
  label: string;
  focused: boolean;
}) => (
  <View className="flex items-center justify-space-around w-20">
    <View className={`items-center justify-center mt-6`}>
      <Image
        source={source}
        style={{ width: 30, height: 24, tintColor: focused ? "#674CFF" : "black" }}
        resizeMode="contain"
      />
    </View>
    <Text
      className={`mt-2 text-xs w-16 text-center font-PoppinsRegular ${
        focused ? "text-primary" : "text-gray-500"
      }`}
      numberOfLines={1}
    >
      {label}
    </Text>
  </View>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#333333",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          paddingVertical: 10,
          elevation: 0,
          height: 70,
        },
      }}
    >
      {tabsConfig.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon source={tab.icon} label={tab.label} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}