import { Plus, Trash2 } from '@/src/utils/icon-interop';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { FoodItem } from '../context/fridgeStore';
import { THEME } from '../theme/theme';

interface FridgeItemCardProps {
  item: FoodItem;
  onAddPress?: () => void;
  onDeletePress?: (id: string) => void;
}

export function FridgeItemCard({ item, onAddPress, onDeletePress }: FridgeItemCardProps) {
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
        marginVertical: THEME.spacing.xs,
        padding: THEME.spacing.md,
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
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: THEME.border.subtle,
          marginRight: THEME.spacing.md,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={item.image 
            ? { uri: item.image } 
            : { uri: 'https://madeinindiarestaurant.com/img/placeholders/comfort_food_placeholder.png?v=1' }
          }
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
          resizeMode="cover"
          onError={(error) => {
            // Silent error handling
          }}
          onLoad={() => {
            // Silent load handling
          }}
        />
      </View>

      {/* Item Details */}
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text 
            style={{
              color: THEME.text.primary,
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'SpaceMono',
              marginBottom: 2,
            }}
          >
            {item.name}
          </Text>
          
          <Text 
            style={{
              color: THEME.text.secondary,
              fontSize: 12,
              fontFamily: 'SpaceMono',
              marginBottom: 4,
            }}
          >
            {item.category}
          </Text>
        </View>
        
        {/* Bottom Row: Quantity, Expiry, Status */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Quantity Display */}
          <View style={{
            backgroundColor: THEME.accent,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}>
            <Text 
              style={{
                color: THEME.background,
                fontSize: 11,
                fontWeight: 'bold',
                fontFamily: 'SpaceMono',
              }}
            >
              Qty: {item.quantity || 1}
            </Text>
          </View>
          
          {/* Expiry Info */}
          <Text 
            style={{
              color: THEME.text.tertiary,
              fontSize: 10,
              fontFamily: 'SpaceMono',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {daysRemaining < 0 
              ? `Expired ${Math.abs(daysRemaining)}d ago`
              : `Expires in ${daysRemaining}d`
            }
          </Text>
          
          {/* Status Badge */}
          <View 
            style={{
              backgroundColor: status.color,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text 
              style={{
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 'bold',
                fontFamily: 'SpaceMono',
              }}
            >
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{
        position: 'absolute',
        top: THEME.spacing.md,
        right: THEME.spacing.md,
        flexDirection: 'row',
        gap: THEME.spacing.sm,
      }}>
        {/* Delete Button */}
        {onDeletePress && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete Item',
                `Are you sure you want to delete ${item.name}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => onDeletePress(item.id) },
                ]
              );
            }}
            style={{
              backgroundColor: THEME.status.expired,
              width: 32,
              height: 32,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: THEME.status.expired,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Trash2 size={16} color={THEME.background} />
          </TouchableOpacity>
        )}
        
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
    </View>
  );
}
