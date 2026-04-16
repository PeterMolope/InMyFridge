import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, Bookmark, ChefHat, Clock, Heart, Users } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { fetchRecipeDetails } from '../api/recipeApi';

interface RecipeDetailsProps {
  recipeId: number;
  onBack: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipeId, onBack }) => {
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => fetchRecipeDetails(recipeId),
    enabled: !!recipeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-gray-600 mt-4">Loading recipe details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <AlertCircle size={64} color="#EF4444" />
        <Text className="text-xl font-bold text-red-700 mt-4 mb-2">
          Failed to Load Recipe
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {(error as Error).message || 'Unable to fetch recipe details. Please try again.'}
        </Text>
        <TouchableOpacity
          onPress={onBack}
          className="bg-primary px-6 py-3 rounded-lg flex-row items-center"
        >
          <ArrowLeft size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <AlertCircle size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-700 mt-4 mb-2">
          Recipe Not Found
        </Text>
        <TouchableOpacity
          onPress={onBack}
          className="bg-primary px-6 py-3 rounded-lg flex-row items-center"
        >
          <ArrowLeft size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderIngredients = () => {
    if (!recipe.extendedIngredients || recipe.extendedIngredients.length === 0) {
      return (
        <View className="p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-500 text-center">No ingredients available</Text>
        </View>
      );
    }

    return (
      <View className="space-y-2">
        {recipe.extendedIngredients.map((ingredient: any, index: number) => (
          <View key={index} className="flex-row items-center p-3 bg-gray-50 rounded-lg">
            <View className="w-2 h-2 bg-primary rounded-full mr-3" />
            <Text className="flex-1 text-gray-700">
              {ingredient.amount && `${ingredient.amount} `}{ingredient.unit && `${ingredient.unit} `}{ingredient.name}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderInstructions = () => {
    if (!recipe.analyzedInstructions || recipe.analyzedInstructions.length === 0) {
      return (
        <View className="p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-500 text-center">No instructions available</Text>
        </View>
      );
    }

    return (
      <View className="space-y-4">
        {recipe.analyzedInstructions[0].steps.map((step: any, index: number) => (
          <View key={index} className="flex-row">
            <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3 mt-1">
              <Text className="text-white font-bold text-sm">{index + 1}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 leading-relaxed">{step.step}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header Image */}
      <View className="relative">
        <Image
          source={{ uri: recipe.image }}
          style={{ width: '100%', height: 250 }}
          resizeMode="cover"
        />
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          className="absolute top-12 left-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="absolute top-12 right-4 flex-row space-x-2">
          <TouchableOpacity className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
            <Heart size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
            <Bookmark size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recipe Info */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-text mb-4">{recipe.title}</Text>

        {/* Recipe Stats */}
        <View className="flex-row space-x-6 mb-6">
          {recipe.readyInMinutes && (
            <View className="flex-row items-center">
              <Clock size={18} color="#666" />
              <Text className="text-gray-600 ml-2">{recipe.readyInMinutes} min</Text>
            </View>
          )}
          {recipe.servings && (
            <View className="flex-row items-center">
              <Users size={18} color="#666" />
              <Text className="text-gray-600 ml-2">{recipe.servings} servings</Text>
            </View>
          )}
          <View className="flex-row items-center">
            <ChefHat size={18} color="#666" />
            <Text className="text-gray-600 ml-2">Recipe</Text>
          </View>
        </View>

        {/* Summary */}
        {recipe.summary && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-text mb-2">About this recipe</Text>
            <Text className="text-gray-600 leading-relaxed">
              {recipe.summary.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        )}

        {/* Ingredients */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-text mb-4">Ingredients</Text>
          {renderIngredients()}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-text mb-4">Instructions</Text>
          {renderInstructions()}
        </View>

        {/* Additional Info */}
        {recipe.sourceUrl && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => console.log('Open recipe URL:', recipe.sourceUrl)}
              className="bg-primary p-4 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">View Full Recipe Online</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RecipeDetails;
