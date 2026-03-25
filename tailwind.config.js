/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fresh Mint Theme Colors using CSS variables
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        popover: "rgb(var(--popover) / <alpha-value>)",
        "popover-foreground": "rgb(var(--popover-foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--secondary-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-foreground": "rgb(var(--accent-foreground) / <alpha-value>)",
        destructive: "rgb(var(--destructive) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        "chart-1": "rgb(var(--chart-1) / <alpha-value>)",
        "chart-2": "rgb(var(--chart-2) / <alpha-value>)",
        "chart-3": "rgb(var(--chart-3) / <alpha-value>)",
        "chart-4": "rgb(var(--chart-4) / <alpha-value>)",
        "chart-5": "rgb(var(--chart-5) / <alpha-value>)",
        sidebar: "rgb(var(--sidebar) / <alpha-value>)",
        "sidebar-foreground": "rgb(var(--sidebar-foreground) / <alpha-value>)",
        "sidebar-primary": "rgb(var(--sidebar-primary) / <alpha-value>)",
        "sidebar-primary-foreground": "rgb(var(--sidebar-primary-foreground) / <alpha-value>)",
        "sidebar-accent": "rgb(var(--sidebar-accent) / <alpha-value>)",
        "sidebar-accent-foreground": "rgb(var(--sidebar-accent-foreground) / <alpha-value>)",
        "sidebar-border": "rgb(var(--sidebar-border) / <alpha-value>)",
        "sidebar-ring": "rgb(var(--sidebar-ring) / <alpha-value>)",
        
        // Abyss Palette (legacy)
        abyss: {
          black: '#050505',
          surface: '#121212',
          layer: '#1a1a1a',
        },
        // Neon Colors (legacy)
        neon: {
          green: '#39FF14',
          cyan: '#00F3FF',
          pink: '#FF00FF',
          purple: '#9D00FF',
          yellow: '#FFFF00',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'neon-green': '0 0 20px #39FF14',
        'neon-cyan': '0 0 20px #00F3FF',
        'neon-pink': '0 0 20px #FF00FF',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
