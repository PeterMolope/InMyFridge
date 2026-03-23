import { Tabs } from "expo-router";
import { ChefHat, PlusCircle, Refrigerator } from "lucide-react-native";
import React from "react";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
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
            <ChefHat size={28} color={color} />
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
