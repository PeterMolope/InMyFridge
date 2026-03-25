import Colors from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { BookOpen, Refrigerator, ShoppingCart, User } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

// Enable className styling for icons
cssInterop(Refrigerator, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(BookOpen, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(ShoppingCart, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(User, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export default function TabsLayout() {
  // Cyber-neon theme colors
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.abyss.surface,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.neon.green,
        tabBarInactiveTintColor: Colors.border,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fridge',
          tabBarIcon: ({ focused }) => (
            <Refrigerator className={focused ? 'text-neon-green' : 'text-border'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ focused }) => (
            <BookOpen className={focused ? 'text-neon-green' : 'text-border'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ focused }) => (
            <ShoppingCart className={focused ? 'text-neon-green' : 'text-border'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <User className={focused ? 'text-neon-green' : 'text-border'} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
