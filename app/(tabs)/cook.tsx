import { Recipe } from '@/src/api/recipeApi';
import IngredientMultiSelector from '@/src/components/IngredientMultiSelector';
import RecipeDetails from '@/src/components/RecipeDetails';
import RecipeSearch from '@/src/components/RecipeSearch';
import { useFridgeStore } from '@/src/context/fridgeStore';
import { Search, Soup } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CookScreen() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);
  const { items } = useFridgeStore();

  const handleGetRecipes = () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('No Ingredients', 'Please select at least one ingredient to find recipes!');
      return;
    }
    setShowRecipes(true);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe.id);
  };

  const handleBackToSelection = () => {
    setShowRecipes(false);
    setSelectedRecipe(null);
  };

  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  // Show recipe details
  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipeId={selectedRecipe}
        onBack={handleBackToRecipes}
      />
    );
  }

  // Show recipe search results
  if (showRecipes) {
    return (
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-card p-4 border-b border-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={handleBackToSelection}>
                <Text className="text-primary font-medium">← Back</Text>
              </TouchableOpacity>
              <View className="flex-row items-center ml-4">
                <Soup size={20} color="#4CAF50" />
                <Text className="text-lg font-bold ml-2 text-text">Recipe Results</Text>
              </View>
            </View>
            <View className="bg-primary/20 px-3 py-1 rounded-full">
              <Text className="text-primary text-sm font-medium">
                {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Recipe Search Results */}
        <RecipeSearch
          selectedIngredientIds={selectedIngredients}
          onRecipeSelect={handleRecipeSelect}
        />
      </View>
    );
  }

  // Show ingredient selection
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Soup size={28} color="#4CAF50" />
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

        {/* Search Recipes button */}
        <View className="mt-6 mb-8">
          <TouchableOpacity
            onPress={handleGetRecipes}
            className={`py-4 rounded-lg items-center shadow-lg flex-row justify-center ${
              selectedIngredients.length === 0 
                ? 'bg-gray-300' 
                : 'bg-primary'
            }`}
            disabled={selectedIngredients.length === 0}
          >
            <Search size={20} color={selectedIngredients.length === 0 ? '#9CA3AF' : 'white'} />
            <Text className={`font-bold text-lg ml-2 ${
              selectedIngredients.length === 0 ? 'text-gray-500' : 'text-white'
            }`}>
              Find Recipes ({selectedIngredients.length})
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
    </ScrollView>
  );
}
