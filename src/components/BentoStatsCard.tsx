import React from 'react';
import { View, Text } from 'react-native';
import { THEME } from '../theme/theme';

interface BentoStatsCardProps {
  title: string;
  value: number;
  color: string;
}

export function BentoStatsCard({ title, value, color }: BentoStatsCardProps) {
  return (
    <View 
      style={{
        backgroundColor: THEME.surface,
        borderRadius: THEME.radius.card,
        padding: THEME.spacing.lg,
        flex: 1,
        marginHorizontal: THEME.spacing.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: THEME.spacing.sm }}>
        <View 
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
            marginRight: THEME.spacing.sm,
          }}
        />
        <Text 
          style={{
            color: THEME.text.secondary,
            fontSize: 14,
            fontFamily: 'SpaceMono',
          }}
        >
          {title}
        </Text>
      </View>
      <Text 
        style={{
          color: THEME.text.primary,
          fontSize: 28,
          fontWeight: 'bold',
          fontFamily: 'SpaceMono',
        }}
      >
        {value}
      </Text>
    </View>
  );
}
