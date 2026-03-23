import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { AlertCircle, ChefHat, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { fetchRecipesByIngredients, Recipe } from '../api/recipeApi';
import { useFridgeStore } from '../context/fridgeStore';

interface RecipeSearchProps {
  selectedIngredientIds: string[];
  onRecipeSelect?: (recipe: Recipe) => void;
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({ 
  selectedIngredientIds, 
  onRecipeSelect 
}) => {
  const { items } = useFridgeStore();

  // Get ingredient names from selected IDs
  const selectedIngredients = items
    .filter(item => selectedIngredientIds.includes(item.id))
    .map(item => item.name);

  const {
    data: recipes = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['recipes', selectedIngredients],
    queryFn: () => fetchRecipesByIngredients({ 
      ingredients: selectedIngredients,
      number: 10,
      ranking: 1,
    }),
    enabled: selectedIngredients.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const renderRecipe = ({ item }: { item: Recipe }) => {
    const usedPercentage = Math.round((item.usedIngredientCount / selectedIngredients.length) * 100);
    
    return (
      <TouchableOpacity
        onPress={() => onRecipeSelect?.(item)}
        className="bg-card m-2 rounded-lg overflow-hidden shadow-sm border border-border"
        activeOpacity={0.7}
      >
        {/* Recipe Image */}
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: 150 }}
          contentFit="cover"
        />
        
        {/* Recipe Content */}
        <View className="p-4">
          <Text className="text-lg font-bold text-text mb-2" numberOfLines={2}>
            {item.title}
          </Text>
          
          {/* Ingredient Match */}
          <View className="flex-row items-center mb-3">
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm text-gray-600">
                  Uses {item.usedIngredientCount} of {selectedIngredients.length} ingredients
                </Text>
                <Text className="text-sm font-semibold text-primary">
                  {usedPercentage}%
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${usedPercentage}%` }}
                />
              </View>
            </View>
          </View>
          
          {/* Missing Ingredients */}
          {item.missedIngredientCount > 0 && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600 mb-1">
                Missing {item.missedIngredientCount} ingredient{item.missedIngredientCount !== 1 ? 's' : ''}:
              </Text>
              <View className="flex-row flex-wrap gap-1">
                {item.missedIngredients.slice(0, 3).map((ingredient, index) => (
                  <View 
                    key={index}
                    className="bg-orange-100 px-2 py-1 rounded-full"
                  >
                    <Text className="text-xs text-orange-700">
                      {ingredient.name}
                    </Text>
                  </View>
                ))}
                {item.missedIngredients.length > 3 && (
                  <View className="bg-orange-100 px-2 py-1 rounded-full">
                    <Text className="text-xs text-orange-700">
                      +{item.missedIngredients.length - 3} more
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Recipe Stats */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <ChefHat size={14} color="#666" />
              <Text className="text-xs text-gray-500 ml-1">Recipe</Text>
            </View>
            {item.likes > 0 && (
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-500">{item.likes} likes</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (selectedIngredients.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ChefHat size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-700 mt-4 mb-2">
          No Ingredients Selected
        </Text>
        <Text className="text-gray-500 text-center px-8">
          Select ingredients from your fridge to find recipes you can make right now!
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-gray-600 mt-4">Finding delicious recipes...</Text>
        <Text className="text-sm text-gray-500 mt-2">
          Using {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <AlertCircle size={64} color="#EF4444" />
        <Text className="text-xl font-bold text-red-700 mt-4 mb-2">
          Recipe Search Failed
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {(error as Error).message || 'Unable to fetch recipes. Please try again.'}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-primary px-6 py-3 rounded-lg flex-row items-center"
          disabled={isRefetching}
        >
          {isRefetching ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <RefreshCw size={16} color="white" />
          )}
          <Text className="text-white font-semibold ml-2">
            {isRefetching ? 'Retrying...' : 'Try Again'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <ChefHat size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-700 mt-4 mb-2">
          No Recipes Found
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          We couldn't find any recipes using the selected ingredients. Try selecting different ingredients or adding more items to your fridge!
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-primary px-6 py-3 rounded-lg flex-row items-center"
          disabled={isRefetching}
        >
          {isRefetching ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <RefreshCw size={16} color="white" />
          )}
          <Text className="text-white font-semibold ml-2">
            {isRefetching ? 'Refreshing...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="px-4 py-3 bg-green-50 border-b border-green-200">
        <Text className="text-green-800 font-medium text-center">
          Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} using your ingredients!
        </Text>
      </View>
      
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default RecipeSearch;
