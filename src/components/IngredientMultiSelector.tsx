import { Check, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FoodItem, useFridgeStore } from '../context/fridgeStore';
import { cn } from '../lib/utils';

interface IngredientMultiSelectorProps {
  selectedIngredients: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  maxVisible?: number;
  showSearch?: boolean;
  className?: string;
}

const IngredientMultiSelector: React.FC<IngredientMultiSelectorProps> = ({
  selectedIngredients,
  onSelectionChange,
  maxVisible = 6,
  showSearch = true,
  className = '',
}) => {
  const { items } = useFridgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Limit visible items unless showAll is true
  const displayItems = showAll ? filteredItems : filteredItems.slice(0, maxVisible);

  const toggleIngredient = (itemId: string) => {
    const newSelection = selectedIngredients.includes(itemId)
      ? selectedIngredients.filter(id => id !== itemId)
      : [...selectedIngredients, itemId];
    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const selectAll = () => {
    onSelectionChange(items.map(item => item.id));
  };

  const renderIngredient = ({ item }: { item: FoodItem }) => {
    const isSelected = selectedIngredients.includes(item.id);
    
    return (
      <TouchableOpacity
        onPress={() => toggleIngredient(item.id)}
        className={cn(
          'flex-row items-center p-3 mb-2 rounded-lg border',
          isSelected 
            ? 'bg-primary/10 border-primary' 
            : 'bg-card border-border'
        )}
      >
        {/* Checkbox */}
        <View className={cn(
          'w-5 h-5 rounded border-2 mr-3 items-center justify-center',
          isSelected 
            ? 'bg-primary border-primary' 
            : 'border-gray-300'
        )}>
          {isSelected && <Check size={12} color="white" />}
        </View>

        {/* Ingredient info */}
        <View className="flex-1">
          <Text className="font-semibold text-text">{item.name}</Text>
          {item.quantity && (
            <Text className="text-sm text-gray-500">Qty: {item.quantity}</Text>
          )}
          {item.category && (
            <Text className="text-xs text-gray-400">{item.category}</Text>
          )}
        </View>

        {/* Expiry indicator */}
        {item.expirationDate && (
          <View className="ml-2">
            {getExpiryIndicator(item.expirationDate)}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getExpiryIndicator = (expirationDate: Date) => {
    const today = new Date();
    const expiryDate = new Date(expirationDate);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let color = 'bg-green-500';
    if (diffDays < 0) color = 'bg-red-500';
    else if (diffDays <= 3) color = 'bg-orange-500';
    else if (diffDays <= 7) color = 'bg-yellow-500';
    
    return (
      <View className={`w-2 h-2 rounded-full ${color}`} />
    );
  };

  const hasMoreItems = filteredItems.length > maxVisible;

  return (
    <View className={cn('bg-card rounded-lg p-4 shadow-sm', className)}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-text">Select Ingredients</Text>
        <View className="flex-row gap-2">
          {selectedIngredients.length > 0 && (
            <TouchableOpacity
              onPress={clearAll}
              className="px-3 py-1 bg-red-100 rounded-full"
            >
              <Text className="text-red-600 text-sm font-medium">Clear All</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={selectAll}
            className="px-3 py-1 bg-green-100 rounded-full"
          >
            <Text className="text-green-600 text-sm font-medium">Select All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      {showSearch && (
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Search size={16} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-gray-700"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Selected count */}
      {selectedIngredients.length > 0 && (
        <View className="mb-3 p-2 bg-primary/5 rounded-lg">
          <Text className="text-primary text-sm font-medium">
            {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      {/* Ingredients list */}
      {displayItems.length === 0 ? (
        <View className="py-8 items-center">
          <Text className="text-gray-500">
            {searchQuery ? 'No ingredients found' : 'No ingredients in fridge'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayItems}
          renderItem={renderIngredient}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 300 }}
        />
      )}

      {/* Show more/less button */}
      {hasMoreItems && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          className="mt-3 items-center"
        >
          <Text className="text-primary font-medium">
            {showAll ? 'Show Less' : `Show ${filteredItems.length - maxVisible} More`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IngredientMultiSelector;
