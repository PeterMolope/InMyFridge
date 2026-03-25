import { Platform } from 'react-native';

export class SystemUIManager {
  static setDarkMode() {
    // Force dark mode throughout the app
    // StatusBar styling is handled by the StatusBar component in layout
    // This method exists for future Android navigation bar customization
  }

  static getStatusBarStyle(): 'light' | 'dark' {
    return 'light'; // Always light content for dark theme
  }

  static getSafeAreaEdges() {
    return ['top', 'left', 'right'] as const;
  }

  static getAndroidNavigationBarConfig() {
    if (Platform.OS === 'android') {
      return {
        // Future Android navigation bar configuration
        // Can be extended with expo-system-ui if needed
        translucent: true,
        style: 'light' as const,
      };
    }
    return {};
  }
}
