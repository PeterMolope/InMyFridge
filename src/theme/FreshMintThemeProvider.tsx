import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, View } from 'react-native';
import { darkTheme, lightTheme } from './FreshMintTheme';

type ThemeMode = 'light' | 'dark';

interface FreshMintThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  currentTheme: typeof lightTheme;
  isDark: boolean;
}

const FreshMintThemeContext = createContext<FreshMintThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'fresh_mint_theme';

export function FreshMintThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTheme(themeMode);
    }
  }, [themeMode, isLoading]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeMode(savedTheme);
      } else {
        // Fallback to system preference if no saved theme
        const colorScheme = Appearance.getColorScheme();
        setThemeMode(colorScheme === 'dark' ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      // Fallback to system preference
      const colorScheme = Appearance.getColorScheme();
      setThemeMode(colorScheme === 'dark' ? 'dark' : 'light');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (themeToSave: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeToSave);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    setThemeMode((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  };

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  const value: FreshMintThemeContextType = {
    themeMode,
    toggleTheme,
    currentTheme,
    isDark: themeMode === 'dark',
  };

  if (isLoading) {
    // Provide a default theme while loading to prevent crashes
    const defaultValue: FreshMintThemeContextType = {
      themeMode: 'light',
      toggleTheme: () => {},
      currentTheme: lightTheme,
      isDark: false,
    };
    
    return (
      <FreshMintThemeContext.Provider value={defaultValue}>
        <View style={{ flex: 1 }} className="light">
          {children}
        </View>
      </FreshMintThemeContext.Provider>
    );
  }

  return (
    <FreshMintThemeContext.Provider value={value}>
      <View style={{ flex: 1 }} className={themeMode}>
        {children}
      </View>
    </FreshMintThemeContext.Provider>
  );
}

export function useFreshMintTheme() {
  const context = useContext(FreshMintThemeContext);
  if (context === undefined) {
    throw new Error('useFreshMintTheme must be used within a FreshMintThemeProvider');
  }
  return context;
}
