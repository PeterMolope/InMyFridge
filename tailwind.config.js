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
        primary: "#4CAF50",
        secondary: "#757575",
        accent: "#03DAC6",
        background: "#121212",
        card: "#1e1e1e",
        text: "#ffffff",
        border: "#333",
      },
    },
  },
  plugins: [],
};
