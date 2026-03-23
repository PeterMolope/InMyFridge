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
    <View className="bg-gray-900 m-2 rounded-lg border border-gray-700 shadow-md">
      <View className="flex-row">
        {/* Selection checkbox */}
        <TouchableOpacity
          onPress={() => onSelect(item.id)}
          className={`w-8 h-8 items-center justify-center border-2 ${
            isSelected 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-600 bg-gray-800'
          }`}
        >
          {isSelected && <Check size={16} color="#39FF14" />}
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
            className="bg-gray-800 items-center justify-center border-l border-gray-600"
          >
            <Text className="text-cyan-400 text-2xl font-bold">
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Food details */}
        <View className="flex-1 p-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-white text-lg font-bold">{item.name}</Text>
            {item.quantity && (
              <View className="ml-2 bg-cyan-900 px-2 py-1 rounded-full">
                <Text className="text-cyan-400 text-xs font-semibold">
                  {item.quantity}x
                </Text>
              </View>
            )}
          </View>
          
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
        <View className="flex-col p-2">
          <TouchableOpacity
            onPress={() => onEat(item.id)}
            className="w-10 h-10 items-center justify-center bg-green-900 rounded-t-lg"
          >
            <Utensils size={16} color="#39FF14" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            className="w-10 h-10 items-center justify-center bg-red-900 rounded-b-lg"
          >
            <Trash2 size={16} color="#FF00FF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;
