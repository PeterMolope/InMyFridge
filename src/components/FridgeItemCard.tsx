import { Plus } from '@/src/utils/icon-interop';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FoodItem } from '../context/fridgeStore';
import { THEME } from '../theme/theme';

interface FridgeItemCardProps {
  item: FoodItem;
  onAddPress?: () => void;
}

export function FridgeItemCard({ item, onAddPress }: FridgeItemCardProps) {
  const getDaysRemaining = () => {
    const today = new Date();
    const expiryDate = new Date(item.expirationDate || Date.now());
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatus = () => {
    const daysRemaining = getDaysRemaining();
    if (daysRemaining < 0) {
      return { label: 'Expired', color: THEME.status.expired };
    } else if (daysRemaining <= 3) {
      return { label: 'Expiring Soon', color: THEME.status.expiring };
    } else {
      return { label: 'Fresh', color: THEME.status.fresh };
    }
  };

  const status = getStatus();
  const daysRemaining = getDaysRemaining();

  return (
    <View 
      style={{
        backgroundColor: THEME.surface,
        borderRadius: THEME.radius.card,
        marginHorizontal: THEME.spacing.md,
        marginVertical: THEME.spacing.sm,
        padding: THEME.spacing.lg,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Item Image */}
      <View 
        style={{
          width: 80,
          height: 80,
          borderRadius: THEME.radius.card / 2,
          backgroundColor: THEME.border.subtle,
          marginRight: THEME.spacing.lg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/80x80' }}
          style={{
            width: 70,
            height: 70,
            borderRadius: THEME.radius.card / 2,
          }}
          resizeMode="cover"
        />
      </View>

      {/* Item Details */}
      <View style={{ flex: 1 }}>
        <Text 
          style={{
            color: THEME.text.primary,
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'SpaceMono',
            marginBottom: THEME.spacing.xs,
          }}
        >
          {item.name}
        </Text>
        
        <Text 
          style={{
            color: THEME.text.secondary,
            fontSize: 14,
            fontFamily: 'SpaceMono',
            marginBottom: THEME.spacing.xs,
          }}
        >
          {item.quantity} - {item.category}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: THEME.spacing.sm }}>
          <Text 
            style={{
              color: THEME.text.tertiary,
              fontSize: 12,
              fontFamily: 'SpaceMono',
              marginRight: THEME.spacing.sm,
            }}
          >
            {daysRemaining < 0 
              ? `Expired ${Math.abs(daysRemaining)} days ago`
              : `Expires in ${daysRemaining} days`
            }
          </Text>
        </View>

        {/* Status Badge */}
        <View 
          style={{
            backgroundColor: status.color,
            borderRadius: THEME.radius.button / 2,
            paddingHorizontal: THEME.spacing.sm,
            paddingVertical: THEME.spacing.xs,
            alignSelf: 'flex-start',
          }}
        >
          <Text 
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 'bold',
              fontFamily: 'SpaceMono',
            }}
          >
            {status.label}
          </Text>
        </View>
      </View>

      {/* Add Button */}
      {onAddPress && (
        <TouchableOpacity
          onPress={onAddPress}
          style={{
            backgroundColor: THEME.accent,
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: THEME.spacing.lg,
            right: THEME.spacing.lg,
            shadowColor: THEME.accent,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Plus size={16} color={THEME.background} />
        </TouchableOpacity>
      )}
    </View>
  );
}
