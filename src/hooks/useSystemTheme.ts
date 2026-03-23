import { useTheme } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook to configure Android System UI for Neon-Cyber theme
 * Implements edge-to-edge display and system bar styling
 */
export function useSystemTheme() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Configure Status Bar for neon theme
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('#000000', true); // Pure black background
      StatusBar.setTranslucent(true);
      
      // Force light icons on dark background
      if (Platform.Version >= 23) {
        StatusBar.setNetworkActivityIndicatorVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Configure Navigation Bar for edge-to-edge
      import('react-native').then(({ NativeModules }) => {
        if (NativeModules.SystemNavigationManager) {
          // Set navigation bar color to transparent black
          NativeModules.SystemNavigationManager?.setNavigationBarColor?.('#000000', false);
        }
      });
    }
  }, []);

  return {
    insets,
    statusBarHeight: insets.top,
    navigationBarHeight: insets.bottom,
    // Safe area padding for components
    safeAreaPadding: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    // Tab bar specific padding (push up by navigation bar height)
    tabBarPadding: {
      paddingBottom: insets.bottom,
      height: 60 + insets.bottom, // Standard tab bar height + insets
    },
  };
}

/**
 * Hook to handle edge-to-edge configuration
 * This should be called once at app root
 */
export function useEdgeToEdge() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Configure edge-to-edge display
      import('react-native').then(({ Platform }) => {
        if (typeof Platform.Version === 'number' && Platform.Version >= 29) {
          // Android 10+ supports gesture navigation
          // Note: Full edge-to-edge requires expo-system-ui or custom native module
          // For now, we'll handle this through expo config plugins
        }
      });
    }
  }, []);
}

/**
 * Performance-aware glass effect hook
 * Returns appropriate glass styling based on device performance
 */
export function useNeonGlass() {
  const insets = useSafeAreaInsets();
  
  // Basic glass effect that works on all devices
  const baseGlass = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: 'rgba(57, 255, 20, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
  };

  // Enhanced glass effect for high-end devices
  const enhancedGlass = {
    ...baseGlass,
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  };

  // For now, return base glass to ensure compatibility
  // Can be enhanced with performance detection later
  return {
    glass: baseGlass,
    enhancedGlass,
    hasPerformance: true, // Can be made dynamic
  };
}
