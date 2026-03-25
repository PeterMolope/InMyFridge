import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { THEME } from '../theme/theme';

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onPress: () => void;
}

export function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isActive ? THEME.accent : THEME.surface,
        borderRadius: THEME.radius.button,
        paddingHorizontal: THEME.spacing.lg,
        paddingVertical: THEME.spacing.sm,
        marginHorizontal: THEME.spacing.xs,
        borderWidth: 1,
        borderColor: isActive ? THEME.accent : THEME.border.subtle,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text 
        style={{
          color: isActive ? THEME.background : THEME.text.secondary,
          fontSize: 14,
          fontWeight: isActive ? 'bold' : 'normal',
          fontFamily: 'SpaceMono',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
