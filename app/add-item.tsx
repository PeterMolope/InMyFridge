import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import IngredientAutocomplete from "../src/components/IngredientAutocomplete";
import QuantityExpiryModal from "../src/components/QuantityExpiryModal";
import { useFridgeStore } from "../src/context/fridgeStore";

interface Ingredient {
  id: number;
  name: string;
  image?: string;
}

export default function AddItemScreen() {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useFridgeStore();

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setShowModal(true);
  };

  const handleModalConfirm = (quantity: number, expiryDate?: Date) => {
    if (!selectedIngredient) return;

    addItem({
      name: selectedIngredient.name.trim(),
      quantity,
      expirationDate: expiryDate,
      image: selectedIngredient.image,
    });

    // Reset state
    setSelectedIngredient(null);
    setShowModal(false);
    router.back();
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedIngredient(null);
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
      
      <QuantityExpiryModal
        visible={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        ingredientName={selectedIngredient?.name || ''}
      />
    </View>
  );
}
