const tintColorLight = "#2f95dc";
const tintColorDark = "#4CAF50"; // Green for fridge theme

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    card: "#f8f9fa",
    border: "#e9ecef",
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    warning: "#ffc107",
    danger: "#dc3545",
  },
  dark: {
    text: "#ffffff",
    background: "#121212", // Dark background
    tint: tintColorDark,
    tabIconDefault: "#888",
    tabIconSelected: tintColorDark,
    card: "#1e1e1e",
    border: "#333",
    primary: "#4CAF50", // Green
    secondary: "#757575",
    success: "#4CAF50",
    warning: "#FF9800",
    danger: "#F44336",
    accent: "#03DAC6", // Teal accent
  },
};
