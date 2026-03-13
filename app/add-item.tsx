import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useFridgeStore } from "@/src/context/fridgeStore";
import { router } from "expo-router";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const { addItem } = useFridgeStore();

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
      <TextInput
        className="bg-card text-text p-3 rounded-lg mb-4 border border-border"
        placeholder="Item name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
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
