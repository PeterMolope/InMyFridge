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
        // Abyss Palette
        abyss: {
          black: '#050505',
          surface: '#121212',
          layer: '#1a1a1a',
        },
        // Neon Colors
        neon: {
          green: '#39FF14',
          cyan: '#00F3FF',
          pink: '#FF00FF',
          purple: '#9D00FF',
          yellow: '#FFFF00',
        },
        // Legacy colors for compatibility
        primary: "#39FF14",
        secondary: "#00F3FF",
        accent: "#FF00FF",
        background: "#050505",
        card: "#121212",
        text: "#ffffff",
        border: "#333",
      },
      fontFamily: {
        tech: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
