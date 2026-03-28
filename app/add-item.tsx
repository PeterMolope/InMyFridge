import { router, useLocalSearchParams } from "expo-router";
import { Calendar } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import IngredientAutocomplete from "../src/components/IngredientAutocomplete";
import QuantityExpiryModal from "../src/components/QuantityExpiryModal";
import { useFridgeStore } from "../src/context/fridgeStore";

interface Ingredient {
  id: number;
  name: string;
  image?: string;
}

export default function AddItemScreen() {
  const params = useLocalSearchParams();
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { addItem } = useFridgeStore();

  // Handle camera params
  useEffect(() => {
    if (params.name) {
      // Pre-fill with camera recognition data
      setSelectedIngredient({
        id: Date.now(),
        name: params.name as string,
        image: params.imageUri as string,
      });
      
      // Show confidence info if available
      if (params.confidence) {
        const confidence = parseFloat(params.confidence as string);
        console.log(`AI Recognition confidence: ${(confidence * 100).toFixed(1)}%`);
      }
    }
  }, [params]);

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

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDirectAdd = () => {
    if (!selectedIngredient) {
      Alert.alert('Error', 'Please select an ingredient first');
      return;
    }

    addItem({
      name: selectedIngredient.name.trim(),
      quantity: 1,
      expirationDate: expiryDate,
      image: selectedIngredient.image,
    });

    // Reset state
    setSelectedIngredient(null);
    setExpiryDate(new Date());
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
      
      {selectedIngredient && (
        <View className="mb-4">
          <Text className="text-text text-lg mb-2">
            Selected: <Text className="font-semibold capitalize">{selectedIngredient.name}</Text>
          </Text>
          
          {/* Expiry Date Input */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center justify-between bg-card border border-border rounded-lg px-4 py-3 mb-4"
          >
            <View className="flex-row items-center">
              <Calendar size={20} color="#6B7280" />
              <Text className="text-text ml-3">
                {expiryDate ? formatDateForDisplay(expiryDate) : 'Select expiry date'}
              </Text>
            </View>
            <Text className="text-secondary text-sm">Optional</Text>
          </TouchableOpacity>
          
          {/* Direct Add Button */}
          <TouchableOpacity
            onPress={handleDirectAdd}
            className="bg-primary p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">Quick Add (1 item)</Text>
          </TouchableOpacity>
          
          {/* Or use modal for more options */}
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="bg-gray-200 p-3 rounded-lg mt-2"
          >
            <Text className="text-gray-700 text-center font-semibold">More Options (Quantity, etc.)</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <QuantityExpiryModal
        visible={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        ingredientName={selectedIngredient?.name || ''}
      />
      
      {/* Glass Date Picker Modal */}
      {/* <GlassDatePicker
        onDateSelect={(date) => {
          setExpiryDate(date);
          setShowDatePicker(false);
        }}
        initialDate={expiryDate}
        minimumDate={new Date()}
      /> */}
    </View>
  );
}
