import React from 'react';
import { Text, TextProps, View, ViewProps } from 'react-native';
import { useFreshMintTheme } from './FreshMintThemeProvider';

interface ThemedViewProps extends ViewProps {
  className?: string;
}

interface ThemedTextProps extends TextProps {
  className?: string;
  variant?: 'heading' | 'body' | 'mono';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export function ThemedView(props: ThemedViewProps) {
  const { isDark } = useFreshMintTheme();
  
  return (
    <View 
      {...props}
      className={`${props.className || ''}`}
    />
  );
}

export function ThemedText(props: ThemedTextProps) {
  const { isDark } = useFreshMintTheme();
  const { variant = 'body', weight = 'normal' } = props;
  
  const getFontWeight = () => {
    switch (weight) {
      case 'bold':
        return '700';
      case 'semibold':
        return '600';
      case 'medium':
        return '500';
      default:
        return '400';
    }
  };

  const getFontFamily = () => {
    switch (variant) {
      case 'heading':
        return 'System';
      case 'mono':
        return 'monospace';
      default:
        return 'System';
    }
  };

  return (
    <Text 
      {...props}
      className={`${props.className || ''}`}
      style={[
        {
          fontFamily: getFontFamily(),
          fontWeight: getFontWeight() as any,
        },
        props.style
      ]}
    />
  );
}
