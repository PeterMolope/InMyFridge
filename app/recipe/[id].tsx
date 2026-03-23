import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeDetails } from "@/src/api/recipeApi";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipeDetails", id],
    queryFn: () =>
      id ? fetchRecipeDetails(Number(id)) : Promise.resolve(null),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-text">Loading recipe...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-danger">Unable to load recipe.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-2">{data.title}</Text>
      {data.image && (
        <Image
          source={{ uri: data.image }}
          className="w-full h-52 rounded mb-4"
        />
      )}
      <Text className="text-secondary mb-2">
        Ready in {data.readyInMinutes} minutes
      </Text>
      <Text className="text-text font-semibold mb-2">Ingredients</Text>
      {data.extendedIngredients?.map((ing) => (
        <Text key={ing.id} className="text-secondary">
          • {ing.original}
        </Text>
      ))}
      <Text className="text-text font-semibold mt-4 mb-2">Instructions</Text>
      <Text className="text-secondary">
        {data.instructions
          ? data.instructions.replace(/<[^>]+>/g, "")
          : "No instructions available."}
      </Text>
    </ScrollView>
  );
}
