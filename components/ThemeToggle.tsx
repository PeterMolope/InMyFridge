import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useFreshMintTheme } from '../src/theme';
import { Sun, Moon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

cssInterop(Sun, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Moon, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export function ThemeToggle() {
  const { themeMode, toggleTheme } = useFreshMintTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="bg-card border border-border rounded-xl p-2"
    >
      {themeMode === 'light' ? (
        <Moon className="text-foreground" size={20} />
      ) : (
        <Sun className="text-foreground" size={20} />
      )}
    </TouchableOpacity>
  );
}
