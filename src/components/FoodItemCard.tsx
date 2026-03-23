import { FoodItem } from '@/src/context/fridgeStore';
import { Image } from 'expo-image';
import { Check, Trash2, Utensils } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FoodItemCardProps {
  item: FoodItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onEat: (id: string) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  isSelected,
  onSelect,
  onRemove,
  onEat,
}) => {
  const getDaysUntilExpiry = () => {
    if (!item.expirationDate) return null;
    
    const today = new Date();
    const expiryDate = new Date(item.expirationDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  
  const getExpiryBadgeColor = () => {
    if (daysUntilExpiry === null) return 'bg-gray-500';
    if (daysUntilExpiry < 0) return 'bg-red-500';
    if (daysUntilExpiry <= 3) return 'bg-orange-500';
    if (daysUntilExpiry <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getExpiryText = () => {
    if (daysUntilExpiry === null) return null;
    if (daysUntilExpiry < 0) return `${Math.abs(daysUntilExpiry)} days overdue`;
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return '1 day';
    return `${daysUntilExpiry} days`;
  };

  const getImageSource = () => {
    if (item.image) {
      return { uri: item.image };
    }
    
    // Use a simple placeholder based on the first letter of the food name
    // In a real app, you might have actual placeholder images
    return null;
  };

  return (
    <View className="bg-card m-2 rounded-lg border border-border overflow-hidden shadow-sm">
      <View className="flex-row">
        {/* Selection checkbox */}
        <TouchableOpacity
          onPress={() => onSelect(item.id)}
          className="w-8 h-8 border border-primary rounded-l-lg items-center justify-center bg-white"
        >
          {isSelected && <Check size={16} color="#4CAF50" />}
        </TouchableOpacity>

        {/* Food image or placeholder */}
        {getImageSource() ? (
          <Image
            source={getImageSource()!}
            style={{ width: 80, height: 80 }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View 
            style={{ width: 80, height: 80 }} 
            className="bg-gray-200 items-center justify-center"
          >
            <Text className="text-gray-500 text-2xl font-bold">
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Food details */}
        <View className="flex-1 p-3">
          <Text className="text-text text-lg font-bold mb-1">{item.name}</Text>
          
          {/* Expiry badge */}
          {daysUntilExpiry !== null && (
            <View className={`self-start px-2 py-1 rounded-full ${getExpiryBadgeColor()}`}>
              <Text className="text-white text-xs font-semibold">
                {getExpiryText()}
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View className="flex-col">
          <TouchableOpacity
            onPress={() => onEat(item.id)}
            className="w-10 h-10 items-center justify-center bg-green-500/10"
          >
            <Utensils size={16} color="#10B981" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            className="w-10 h-10 items-center justify-center bg-red-500/10"
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;
