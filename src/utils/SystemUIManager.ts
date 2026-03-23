
export class SystemUIManager {
  static setTheme(theme: 'light' | 'dark') {
    // The StatusBar component from expo-status-bar handles this automatically
    // We'll use the component in our layout instead
  }

  static getStatusBarStyle(theme: 'light' | 'dark'): 'light' | 'dark' {
    return theme === 'dark' ? 'light' : 'dark';
  }
}
