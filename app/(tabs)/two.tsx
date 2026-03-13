import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useFridgeStore } from "@/src/context/fridgeStore";
import { fetchRecipesByIngredients, Recipe } from "@/src/api/recipeApi";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

export default function RecipesScreen() {
  const { selectedItems, items } = useFridgeStore();

  const selectedNames = items
    .filter((item) => selectedItems.includes(item.id))
    .map((item) => item.name);

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", selectedNames],
    queryFn: () => fetchRecipesByIngredients(selectedNames),
    enabled: selectedNames.length > 0,
  });

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      onPress={() => router.push(`/recipe/${item.id}`)}
      className="bg-card p-4 m-2 rounded-lg border border-border"
    >
      <Image source={{ uri: item.image }} className="w-full h-32 rounded" />
      <Text className="text-text text-lg font-bold mt-2">{item.title}</Text>
      <Text className="text-secondary">
        Used: {item.usedIngredientCount}, Missed: {item.missedIngredientCount}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-text">Loading recipes...</Text>
      </View>
    );
  if (error)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-danger">Error loading recipes</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-4">Recipes</Text>
      {selectedNames.length === 0 ? (
        <Text className="text-secondary">
          Select ingredients in the Fridge tab to get recipes
        </Text>
      ) : (
        <>
          <Text className="text-secondary mb-4">
            Selected ingredients: {selectedNames.join(", ")}
          </Text>
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipe}
            ListEmptyComponent={
              <Text className="text-secondary">No recipes found</Text>
            }
          />
        </>
      )}
    </View>
  );
}
