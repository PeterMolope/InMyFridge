import { FoodItem, useFridgeStore } from "@/src/context/fridgeStore";
import { router } from "expo-router";
import { Check, ChefHat, Circle, Plus, Square } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function FridgeScreen() {
  const { items, removeItem, selectedItems, toggleSelectItem } =
    useFridgeStore();

  const renderItem = ({ item }: { item: FoodItem }) => (
    <View className="bg-card p-4 m-2 rounded-lg border border-border flex-row items-center">
      <TouchableOpacity
        onPress={() => toggleSelectItem(item.id)}
        className="w-6 h-6 border border-primary rounded mr-4 items-center justify-center"
      >
        {selectedItems.includes(item.id) && <Check size={16} color="#4CAF50" />}
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-text text-lg font-bold">{item.name}</Text>
        {item.expirationDate && (
          <Text className="text-secondary">
            Expires: {item.expirationDate.toDateString()}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => removeItem(item.id)}
        className="bg-danger p-2 rounded"
      >
        <Text className="text-white">Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const handleGetRecipes = () => {
    if (selectedItems.length === 0) {
      alert("Please select some ingredients first");
      return;
    }
    router.push({ pathname: "/(tabs)/recipes" });
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-4">My Fridge</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <View className="relative mb-8">
              <Square size={120} color="#9CA3AF" />
              <Circle 
                size={40} 
                color="#E5E7EB" 
                style={{ position: 'absolute', top: -10, right: -10 }}
              />
            </View>
            <Text className="text-text text-2xl font-bold mb-2 text-center">
              Your fridge is lonely
            </Text>
            <Text className="text-secondary text-lg mb-8 text-center px-8">
              Start adding ingredients to keep track of your food and get recipe suggestions!
            </Text>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/add-item" })}
              className="bg-primary px-8 py-4 rounded-full flex-row items-center"
            >
              <Plus size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Add Your First Item</Text>
            </TouchableOpacity>
          </View>
        }
      />
      <View className="absolute bottom-4 right-4 flex-row">
        <TouchableOpacity
          onPress={handleGetRecipes}
          className="bg-accent p-4 rounded-full mr-4"
        >
          <ChefHat size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/add-item" })}
          className="bg-primary p-4 rounded-full"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
