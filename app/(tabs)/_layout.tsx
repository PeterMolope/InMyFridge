import { ChefHat, Home, Plus, Utensils } from '@/src/utils/icon-interop';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0e0e0e',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#8eff71',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Fridge",
          tabBarIcon: ({ focused }) => (
            <Home size={24} color={focused ? '#8eff71' : '#888888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="cook"
        options={{
          title: "Cook",
          tabBarIcon: ({ focused }) => (
            <ChefHat size={24} color={focused ? '#8eff71' : '#888888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ focused }) => (
            <Utensils size={24} color={focused ? '#8eff71' : '#888888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: "Add",
          tabBarIcon: ({ focused }) => (
            <Plus size={24} color={focused ? '#8eff71' : '#888888'} />
          ),
        }}
      />
    </Tabs>
  );
}
