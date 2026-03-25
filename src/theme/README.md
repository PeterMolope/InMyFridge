# Fresh Mint Theme Integration

This theme provides a fresh, minty color scheme perfect for your InMyFridge app. It features teal/mint green primary colors with both light and dark mode support.

## Features

- **Fresh Mint Colors**: Teal/mint green (#14B8A6) primary colors
- **Light & Dark Mode**: Automatic theme switching with persistence
- **NativeWind Integration**: Uses CSS variables for dynamic theming
- **Typography**: Inter and JetBrains Mono fonts with weight variants
- **Component Support**: ThemedView and ThemedText components

## Installation

The theme is already integrated into your project. Here's how to use it:

## Usage

### 1. Wrap Your App

```tsx
import { FreshMintThemeProvider } from './src/theme';

export default function App() {
  return (
    <FreshMintThemeProvider>
      {/* Your app components */}
    </FreshMintThemeProvider>
  );
}
```

### 2. Use Themed Components

```tsx
import { ThemedView, ThemedText, useFreshMintTheme } from './src/theme';

function MyComponent() {
  const { themeMode, toggleTheme } = useFreshMintTheme();

  return (
    <ThemedView className="flex-1 bg-background p-4">
      <ThemedText className="text-foreground">
        Hello, Fresh Mint Theme!
      </ThemedText>
      
      <TouchableOpacity onPress={toggleTheme}>
        <ThemedText className="text-primary">
          Toggle Theme
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
```

### 3. Available Colors

Use these Tailwind classes with the theme:

- `bg-background` / `text-foreground` - Main background/text
- `bg-primary` / `text-primary` - Teal/mint primary color
- `bg-secondary` / `text-secondary` - Light mint secondary
- `bg-card` / `text-card-foreground` - Card backgrounds
- `bg-muted` / `text-muted-foreground` - Muted/secondary text
- `bg-accent` / `text-accent-foreground` - Accent colors
- `border-border` - Border colors
- `bg-destructive` - Error/danger color

### 4. Typography Options

```tsx
<ThemedText variant="heading" weight="bold" className="text-2xl">
  Bold Heading
</ThemedText>

<ThemedText variant="body" weight="medium">
  Body Text
</ThemedText>

<ThemedText variant="mono" weight="normal">
  Monospace Text
</ThemedText>
```

## Theme Colors

### Light Mode
- **Primary**: Teal/Mint (#14B8A6)
- **Background**: Very light minty white
- **Cards**: Pure white
- **Text**: Dark gray

### Dark Mode
- **Primary**: Lighter teal (#2DD4BF)
- **Background**: Dark gray
- **Cards**: Darker gray
- **Text**: Light minty white

## File Structure

```
src/theme/
├── FreshMintTheme.ts              # Theme variables and fonts
├── FreshMintThemeProvider.tsx     # Theme provider and context
├── ThemedComponents.tsx           # ThemedView and ThemedText
├── index.ts                       # Exports
├── ExampleUsage.tsx               # Usage examples
└── README.md                      # This file
```

## Integration Notes

- The theme uses NativeWind CSS variables for dynamic theming
- Theme preference is automatically saved to AsyncStorage
- Falls back to system preference if no saved theme exists
- Compatible with existing Neon theme (can be used side-by-side)
- Tailwind config updated to support CSS variables

## CSS Variables

The theme defines CSS variables for all colors, which are automatically applied based on the current theme mode. These variables are used by Tailwind classes for consistent theming throughout your app.
