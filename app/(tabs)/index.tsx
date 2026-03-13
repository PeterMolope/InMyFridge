import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useFridgeStore, FoodItem } from "@/src/context/fridgeStore";
import { Plus, ChefHat, Check } from "lucide-react-native";
import { router } from "expo-router";

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
    router.push("/recipes");
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-4">My Fridge</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text className="text-secondary">No items in fridge</Text>
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
          onPress={() => router.push("/add-item")}
          className="bg-primary p-4 rounded-full"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
