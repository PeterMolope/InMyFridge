import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FreshMintThemeProvider, ThemedText, ThemedView, useFreshMintTheme } from './index';

// Example component showing how to use the fresh mint theme
function ExampleScreen() {
  const { themeMode, toggleTheme, isDark } = useFreshMintTheme();

  return (
    <ThemedView className="flex-1 bg-background p-4">
      <ThemedText className="text-2xl font-bold text-foreground mb-4">
        Fresh Mint Theme Demo
      </ThemedText>
      
      <ThemedText className="text-muted-foreground mb-6">
        Current mode: {themeMode}
      </ThemedText>

      <TouchableOpacity 
        onPress={toggleTheme}
        className="bg-primary p-4 rounded-lg mb-4"
      >
        <ThemedText className="text-primary-foreground text-center font-semibold">
          Toggle Theme
        </ThemedText>
      </TouchableOpacity>

      <ThemedView className="bg-card p-4 rounded-lg border border-border">
        <ThemedText className="text-card-foreground font-semibold mb-2">
          Card Example
        </ThemedText>
        <ThemedText className="text-muted-foreground">
          This card uses the fresh mint theme colors and adapts automatically 
          to light/dark mode.
        </ThemedText>
      </ThemedView>

      <ThemedView className="mt-4">
        <ThemedText variant="heading" weight="bold" className="text-primary mb-2">
          Heading Text
        </ThemedText>
        <ThemedText variant="body" className="text-foreground mb-2">
          Body text with Inter font
        </ThemedText>
        <ThemedText variant="mono" className="text-muted-foreground">
          Monospace text with JetBrains Mono
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

// Wrap your app with the FreshMintThemeProvider
export default function App() {
  return (
    <FreshMintThemeProvider>
      <ExampleScreen />
    </FreshMintThemeProvider>
  );
}
