import { DarkModeToggle } from "@/src/components/DarkModeToggle";
import FoodItemCard from "@/src/components/FoodItemCard";
import { FoodItem, useFridgeStore } from "@/src/context/fridgeStore";
import { router } from "expo-router";
import { ChefHat, Circle, Plus, Square } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function FridgeScreen() {
  const { items, removeItem, selectedItems, toggleSelectItem } = useFridgeStore();

  const handleEat = (id: string) => {
    // In a real app, you might want to track eaten items or show a confirmation
    console.log(`Item ${id} marked as eaten`);
    removeItem(id);
  };

  const renderItem = ({ item }: { item: FoodItem }) => (
    <FoodItemCard
      item={item}
      isSelected={selectedItems.includes(item.id)}
      onSelect={toggleSelectItem}
      onRemove={removeItem}
      onEat={handleEat}
    />
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
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-text text-2xl font-bold">My Fridge</Text>
        <DarkModeToggle />
      </View>
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
