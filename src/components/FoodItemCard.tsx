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
    if (daysUntilExpiry === null) return 'bg-gray-500/50';
    if (daysUntilExpiry < 0) return 'bg-red-500/50 border border-red-500';
    if (daysUntilExpiry <= 3) return 'bg-orange-500/50 border border-orange-500';
    if (daysUntilExpiry <= 7) return 'bg-yellow-500/50 border border-yellow-500';
    return 'bg-primary/20 border border-primary';
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
    <View className="bg-card m-2 rounded-xl border border-white/18 shadow-glass overflow-hidden">
      <View className="flex-row">
        {/* Selection checkbox */}
        <TouchableOpacity
          onPress={() => onSelect(item.id)}
          className={`w-8 h-8 rounded-l-lg items-center justify-center border-2 ${
            isSelected 
              ? 'bg-primary/20 border-primary shadow-neon-green' 
              : 'border-white/18 bg-abyss-layer/50'
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
            className="rounded-r-lg"
          />
        ) : (
          <View 
            style={{ width: 80, height: 80 }} 
            className="bg-abyss-layer/50 items-center justify-center border-r border-white/18"
          >
            <Text className="text-secondary text-2xl font-bold font-mono">
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Food details */}
        <View className="flex-1 p-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-white text-lg font-bold font-tech">{item.name}</Text>
            {item.quantity && (
              <View className="ml-2 bg-secondary/20 px-2 py-1 rounded-full border border-secondary/50">
                <Text className="text-secondary text-xs font-semibold font-tech">
                  {item.quantity}x
                </Text>
              </View>
            )}
          </View>
          
          {/* Expiry badge */}
          {daysUntilExpiry !== null && (
            <View className={`self-start px-2 py-1 rounded-full ${getExpiryBadgeColor()}`}>
              <Text className="text-white text-xs font-semibold font-tech">
                {getExpiryText()}
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View className="flex-col space-y-2 p-2">
          <TouchableOpacity
            onPress={() => onEat(item.id)}
            className="w-10 h-10 items-center justify-center bg-primary/10 border border-primary/30 rounded-lg"
          >
            <Utensils size={16} color="#39FF14" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            className="w-10 h-10 items-center justify-center bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <Trash2 size={16} color="#FF00FF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FoodItemCard;
