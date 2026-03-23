import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import IngredientAutocomplete from "../src/components/IngredientAutocomplete";
import { useFridgeStore } from "../src/context/fridgeStore";

interface Ingredient {
  id: number;
  name: string;
  image?: string;
}

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const { addItem } = useFridgeStore();

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setName(ingredient.name);
  };

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }
    const expDate = expirationDate ? new Date(expirationDate) : undefined;
    addItem({ name: name.trim(), expirationDate: expDate });
    setName("");
    setExpirationDate("");
    router.back();
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-4">
        Add Item to Fridge
      </Text>
      
      <IngredientAutocomplete
        onIngredientSelect={handleIngredientSelect}
        placeholder="Search or type ingredient name..."
        className="mb-4"
      />
      
      <TextInput
        className="bg-card text-text p-3 rounded-lg mb-4 border border-border"
        placeholder="Expiration date (YYYY-MM-DD)"
        placeholderTextColor="#888"
        value={expirationDate}
        onChangeText={setExpirationDate}
      />
      <TouchableOpacity
        onPress={handleAdd}
        className="bg-primary p-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}
