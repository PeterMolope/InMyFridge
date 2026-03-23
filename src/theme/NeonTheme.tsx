import React, { createContext, ReactNode, useContext } from 'react';

// Neon-Cyber Theme Configuration
export const NeonTheme = {
  colors: {
    // Base Colors
    background: '#000000', // Pure Black
    surface: '#0a0a0a', // Slightly lighter black for cards
    surfaceVariant: '#1a1a1a', // Dark gray for variants
    
    // Neon Accents
    primary: '#39FF14', // Electric Neon Green
    primaryVariant: '#32CC10', // Darker neon green
    secondary: '#00FF41', // Alternative neon green
    
    // Text Colors
    text: '#FFFFFF', // Pure white for high contrast
    textSecondary: '#B0B0B0', // Grayed text
    textTertiary: '#808080', // More grayed text
    
    // Border & Outline
    border: '#39FF14', // Neon green borders
    borderVariant: '#32CC10', // Darker neon borders
    
    // Status Colors
    success: '#00FF41', // Bright green
    warning: '#FFD700', // Gold warning
    error: '#FF3366', // Neon red
    info: '#00FFFF', // Cyan
    
    // Glass Effect Colors
    glass: 'rgba(57, 255, 20, 0.1)', // Neon green with transparency
    glassBorder: 'rgba(57, 255, 20, 0.3)', // Neon green border
    glassBackground: 'rgba(0, 0, 0, 0.8)', // Dark glass background
    
    // Shadow & Glow
    shadow: 'rgba(57, 255, 20, 0.5)', // Neon green shadow
    glow: 'rgba(57, 255, 20, 0.8)', // Intense neon glow
  },
  
  // Typography
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      letterSpacing: 1,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#FFFFFF',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      color: '#B0B0B0',
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Glass Effect Configuration
  glass: {
    backdropBlur: 15,
    background: 'rgba(0, 0, 0, 0.8)',
    border: 'rgba(57, 255, 20, 0.3)',
    shadow: 'rgba(57, 255, 20, 0.5)',
  },
  
  // Animation
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease-out',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

// Theme Context
type ThemeContextType = {
  theme: typeof NeonTheme;
  isNeonMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
export function NeonThemeProvider({ children }: { children: ReactNode }) {
  const themeValue: ThemeContextType = {
    theme: NeonTheme,
    isNeonMode: true,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useNeonTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useNeonTheme must be used within a NeonThemeProvider');
  }
  return context;
}

// Export for navigation compatibility
export const NeonColors = {
  dark: NeonTheme.colors,
  light: NeonTheme.colors, // Same theme for both modes
};
