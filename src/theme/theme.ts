// Dark Theme Constants for InMyFridge App
// No light mode - dark theme only

export const THEME = {
  // Background Colors
  background: '#121212', // Deep Charcoal Black
  surface: '#1E1E1E', // Lighter gray for cards and input fields
  
  // Accent Colors
  accent: '#39FF14', // Neon Green for active elements
  accentBright: '#8EFF71', // Brighter neon green for hover states
  
  // Status Colors
  status: {
    fresh: '#39FF14', // Neon Green for "Fresh"
    expiring: '#FF9F0A', // Orange for "Expiring Soon"
    expired: '#FF453A', // Red for "Expired"
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF', // White for primary text
    secondary: '#888888', // Gray for secondary text
    tertiary: '#666666', // Darker gray for tertiary text
  },
  
  // Border Colors
  border: {
    default: '#333333', // Default border color
    active: '#39FF14', // Active border with neon green
    subtle: '#2A2A2A', // Subtle border for inactive states
  },
  
  // Component Specific
  tabBar: {
    background: '#0e0e0e', // Very dark for tab bar
    active: '#39FF14', // Neon green for active tabs
    inactive: '#888888', // Gray for inactive tabs
  },
  
  // Shadow Colors
  shadow: {
    neon: '0 0 20px rgba(57, 255, 20, 0.3)', // Neon green shadow
    card: '0 4px 20px rgba(0, 0, 0, 0.25)', // Card shadow
  },
  
  // Radius Values
  radius: {
    card: 20, // Border radius for cards
    button: 12, // Border radius for buttons
    input: 16, // Border radius for input fields
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
} as const;

export type ThemeType = typeof THEME;
