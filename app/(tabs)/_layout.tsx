import { Tabs } from "expo-router";
import { PlusCircle, Refrigerator, SoupIcon, UtensilsCrossed } from 'lucide-react-native';
import React from "react";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Colors from "@/constants/Colors";
import { useTheme } from "@/src/context/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[theme].background,
          borderTopColor: Colors[theme].border,
        },
        tabBarLabelStyle: {
          color: Colors[theme].text,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Fridge",
          tabBarIcon: ({ color }) => (
            <Refrigerator size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cook"
        options={{
          title: "Cook",
          tabBarIcon: ({ color }) => (
            <SoupIcon size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => (
            <UtensilsCrossed size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <PlusCircle size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
