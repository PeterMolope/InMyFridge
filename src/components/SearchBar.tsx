import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, Filter } from '@/src/utils/icon-interop';
import { THEME } from '../theme/theme';

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
}

export function SearchBar({ placeholder, value, onChangeText, onFilterPress }: SearchBarProps) {
  return (
    <View 
      style={{
        backgroundColor: THEME.surface,
        borderRadius: THEME.radius.input,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.lg,
        paddingVertical: THEME.spacing.md,
        marginHorizontal: THEME.spacing.md,
        marginVertical: THEME.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Search size={20} color={THEME.text.secondary} style={{ marginRight: THEME.spacing.md }} />
      <TextInput
        style={{
          flex: 1,
          color: THEME.text.primary,
          fontSize: 16,
          fontFamily: 'SpaceMono',
        }}
        placeholder={placeholder}
        placeholderTextColor={THEME.text.secondary}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onFilterPress} style={{ marginLeft: THEME.spacing.md }}>
        <Filter size={20} color={THEME.text.secondary} />
      </TouchableOpacity>
    </View>
  );
}
