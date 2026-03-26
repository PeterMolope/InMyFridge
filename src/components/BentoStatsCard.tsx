import React from 'react';
import { Text, View } from 'react-native';
import { THEME } from '../theme/theme';

interface BentoStatsCardProps {
  title: string;
  value: number;
  color: string;
  abbreviation?: string;
}

export function BentoStatsCard({ title, value, color, abbreviation }: BentoStatsCardProps) {
  const displayTitle = abbreviation || title;
  return (
    <View 
      style={{
        backgroundColor: THEME.surface,
        borderRadius: 12,
        padding: THEME.spacing.sm,
        flex: 1,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        minHeight: 60,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <View 
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: color,
            marginRight: 6,
          }}
        />
        <Text 
          style={{
            color: '#888888',
            fontSize: 10,
            fontFamily: 'SpaceMono',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {displayTitle}
        </Text>
      </View>
      <Text 
        style={{
          color: THEME.text.primary,
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'SpaceMono',
          textAlign: 'center',
          flex: 1,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
