import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ChefHat } from 'lucide-react-native';
import IngredientMultiSelector from '@/src/components/IngredientMultiSelector';
import { useFridgeStore } from '@/src/context/fridgeStore';

export default function CookScreen() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const { items } = useFridgeStore();

  const handleCookNow = () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('No Ingredients', 'Please select at least one ingredient to cook with!');
      return;
    }
    
    const selectedItems = items.filter(item => selectedIngredients.includes(item.id));
    const ingredientNames = selectedItems.map(item => item.name).join(', ');
    
    Alert.alert(
      'Ready to Cook!',
      `You've selected ${selectedIngredients.length} ingredient${selectedIngredients.length !== 1 ? 's' : ''}:\n\n${ingredientNames}\n\nWhat would you like to make?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Get Recipes', onPress: () => console.log('Navigate to recipes') }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background p-4">
      <View className="mb-6">
        <View className="flex-row items-center mb-2">
          <ChefHat size={28} color="#4CAF50" />
          <Text className="text-2xl font-bold ml-3 text-text">What's Cooking?</Text>
        </View>
        <Text className="text-gray-600">
          Select ingredients from your fridge that you want to cook with right now
        </Text>
      </View>

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
          className={`py-4 rounded-lg items-center shadow-lg ${
            selectedIngredients.length === 0 
              ? 'bg-gray-300' 
              : 'bg-primary'
          }`}
          disabled={selectedIngredients.length === 0}
        >
          <Text className={`font-bold text-lg ${
            selectedIngredients.length === 0 ? 'text-gray-500' : 'text-white'
          }`}>
            Cook Now ({selectedIngredients.length})
          </Text>
        </TouchableOpacity>
        
        {selectedIngredients.length > 0 && (
          <View className="mt-3 p-3 bg-green-50 rounded-lg">
            <Text className="text-center text-green-700 font-medium">
              Perfect! You have {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
        )}

        {items.length === 0 && (
          <View className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <Text className="text-center text-yellow-800">
              Your fridge is empty! Add some ingredients first to start cooking.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
