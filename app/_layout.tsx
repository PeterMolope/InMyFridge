import {
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

import { SplashScreen as CustomSplashScreen } from "../src/components/SplashScreen";
import { QueryProvider } from "../src/providers/QueryProvider";
import { NeonThemeProvider } from "../src/theme/NeonTheme";
import { THEME } from "../src/theme/theme";
import { SystemUIManager } from "../src/utils/SystemUIManager";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const handleSplashComplete = () => {
    setShowCustomSplash(false);
    // Hide the native splash screen after custom splash completes
    SplashScreen.hideAsync();
  };

  if (!loaded) {
    return null;
  }

  if (showCustomSplash) {
    return (
      <QueryProvider>
        <NeonThemeProvider>
          <CustomSplashScreen onComplete={handleSplashComplete} />
        </NeonThemeProvider>
      </QueryProvider>
    );
  }

  return (
    <QueryProvider>
      <NeonThemeProvider>
        <RootLayoutNav />
      </NeonThemeProvider>
    </QueryProvider>
  );
}

function RootLayoutNav() {
  // Initialize system UI for dark mode
  useEffect(() => {
    SystemUIManager.setDarkMode();
  }, []);

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: THEME.background }} 
      edges={SystemUIManager.getSafeAreaEdges()}
    >
      <StatusBar style="light" backgroundColor={THEME.background} />
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaView>
  );
}
