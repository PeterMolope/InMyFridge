import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IngredientMultiSelector from './IngredientMultiSelector';
import { useFridgeStore } from '../context/fridgeStore';

const IngredientSelectorExample: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const { items } = useFridgeStore();

  const handleCookNow = () => {
    if (selectedIngredients.length === 0) {
      alert('Please select at least one ingredient to cook with!');
      return;
    }
    
    const selectedItems = items.filter(item => selectedIngredients.includes(item.id));
    const ingredientNames = selectedItems.map(item => item.name).join(', ');
    alert(`Cooking with: ${ingredientNames}`);
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-2 text-center">What's Cooking?</Text>
      <Text className="text-gray-600 mb-6 text-center">
        Select ingredients from your fridge that you want to cook with right now
      </Text>

      <IngredientMultiSelector
        selectedIngredients={selectedIngredients}
        onSelectionChange={setSelectedIngredients}
        maxVisible={8}
        showSearch={true}
      />

      {/* Cook button */}
      <View className="mt-6">
        <TouchableOpacity
          onPress={handleCookNow}
          className="bg-primary py-4 rounded-lg items-center shadow-lg"
          disabled={selectedIngredients.length === 0}
        >
          <Text className="text-white font-bold text-lg">
            Cook Now ({selectedIngredients.length})
          </Text>
        </TouchableOpacity>
        
        {selectedIngredients.length > 0 && (
          <Text className="text-center mt-3 text-gray-600">
            {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
          </Text>
        )}
      </View>
    </View>
  );
};

export default IngredientSelectorExample;
