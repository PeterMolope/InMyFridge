import { Tabs } from 'expo-router';
import { BookOpen, Refrigerator, ShoppingCart, User } from 'lucide-react-native';
import { cssInterop, useColorScheme } from 'nativewind';
import React from 'react';

<<<<<<< HEAD
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.neon.green,
        tabBarInactiveTintColor: Colors.border,
        tabBarStyle: {
          backgroundColor: Colors.abyss.surface,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          color: Colors.text,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
=======
// Enable className styling for icons
cssInterop(Refrigerator, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(BookOpen, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(ShoppingCart, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(User, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Fresh mint theme colors
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          borderTopColor: isDark ? '#333333' : '#e5e5e5',
        },
        tabBarActiveTintColor: '#14B8A6',
        tabBarInactiveTintColor: isDark ? '#888888' : '#999999',
>>>>>>> 031a0da17b310d30c5e459207adb6384aa5dfc04
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fridge',
          tabBarIcon: ({ focused }) => (
            <Refrigerator className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ focused }) => (
            <BookOpen className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }) => (
            <ShoppingCart className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="cook"
        options={{
          title: 'Cook',
          tabBarIcon: ({ focused }) => (
            <User className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
