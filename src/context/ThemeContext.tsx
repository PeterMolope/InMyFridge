import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved theme on app start
    loadTheme();
  }, []);

  useEffect(() => {
    // Save theme whenever it changes
    if (!isLoading) {
      saveTheme(theme);
    }
  }, [theme, isLoading]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        // Fallback to system preference if no saved theme
        const colorScheme = Appearance.getColorScheme();
        setTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      // Fallback to system preference
      const colorScheme = Appearance.getColorScheme();
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (themeToSave: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeToSave);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  if (isLoading) {
    // Provide a default theme while loading to prevent crashes
    const defaultValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: () => {},
      isDark: false,
    };
    
    return (
      <ThemeContext.Provider value={defaultValue}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
