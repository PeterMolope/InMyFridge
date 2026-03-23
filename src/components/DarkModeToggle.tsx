import React from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export function DarkModeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="p-2 rounded-full bg-card border border-border"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="w-8 h-8 items-center justify-center">
        {isDark ? (
          <Sun size={20} color="#FFB800" />
        ) : (
          <Moon size={20} color="#6B7280" />
        )}
      </View>
    </TouchableOpacity>
  );
}
