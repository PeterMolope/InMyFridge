import { router } from "expo-router";
import { Calendar, Package, Plus, X } from "lucide-react-native";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFridgeStore } from "../src/context/fridgeStore";

// Enable className styling for icons
cssInterop(Calendar, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(X, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Plus, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Package, { className: { target: 'style', nativeStyleToProp: { color: true } } });

const categories = [
  'Veggies',
  'Fruits', 
  'Meat',
  'Dairy',
  'Bakery',
  'Drinks'
];

export default function AddItemScreen() {
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Veggies');
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { addItem } = useFridgeStore();

  const handleAddItem = () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    addItem({
      name: itemName.trim(),
      quantity: 1,
      expirationDate: expiryDate,
      category: selectedCategory,
    });

    // Reset state and go back
    setItemName('');
    setSelectedCategory('Veggies');
    setExpiryDate(new Date());
    router.back();
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View className="flex-1 bg-surface-container-lowest relative">
      {/* Background Content Layer */}
      <View className="absolute inset-0 glowing-grid z-0" />
      <View className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container-lowest to-surface-container-lowest z-10" />

      {/* Top App Bar */}
      <View className="fixed top-0 w-full flex-row justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-xl z-50">
        <View className="flex-row items-center gap-3">
          <Text className="text-xl font-bold text-primary tracking-[0.2em] uppercase">
            InMyFridge
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="w-10 h-10 flex items-center justify-center text-primary">
            <Package size={24} />
          </TouchableOpacity>
          <View className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden">
            <Image 
              source={{ uri: 'https://via.placeholder.com/32' }} 
              className="w-full h-full object-cover"
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="pt-24 pb-32 px-6 flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 min-h-screen justify-center">
          {/* Modal Container */}
          <View className="w-full max-w-lg bg-surface-variant/40 backdrop-blur-2xl rounded-full border border-outline-variant/20 shadow-lg overflow-hidden relative">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center px-8 py-6 border-b border-outline-variant/10">
              <Text className="font-bold text-2xl tracking-tight text-on-surface uppercase">
                New Item
              </Text>
              <TouchableOpacity onPress={() => router.back()} className="p-2">
                <X size={24} className="text-on-surface-variant" />
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className="p-8 space-y-10">
              {/* Item Name Input */}
              <View className="space-y-3">
                <Text className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant px-1 font-bold">
                  Item Name
                </Text>
                <View className="relative">
                  <TextInput
                    value={itemName}
                    onChangeText={setItemName}
                    placeholder="e.g. Organic Kale"
                    placeholderTextColor="rgb(var(--outline-variant))"
                    className="w-full bg-transparent border-none border-b border-outline text-on-surface px-0 py-3 text-lg focus:outline-none"
                  />
                  <View className="absolute bottom-0 left-0 h-[1px] bg-primary w-full" />
                </View>
              </View>

              {/* Category Scroll Chips */}
              <View className="space-y-4">
                <View className="flex-row justify-between items-end px-1">
                  <Text className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                    Category
                  </Text>
                  <Text className="text-[10px] font-bold text-primary/50">
                    Required
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
                  <View className="flex-row gap-3">
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full border ${
                          selectedCategory === category
                            ? 'bg-primary/10 border-primary/40'
                            : 'bg-surface-container-high border-outline-variant/30'
                        }`}
                      >
                        <Text className={`text-xs font-bold uppercase tracking-widest ${
                          selectedCategory === category
                            ? 'text-primary'
                            : 'text-on-surface-variant'
                        }`}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Expiry Date Field */}
              <View className="space-y-3">
                <Text className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant px-1 font-bold">
                  Expiry Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="relative flex-row items-center bg-surface-container-high/40 p-5 rounded-xl border border-outline-variant/20 overflow-hidden"
                >
                  <Calendar size={20} className="text-primary mr-4 opacity-70" />
                  <Text className="text-on-surface/80 font-medium">
                    {expiryDate ? formatDateForDisplay(expiryDate) : 'Select Date'}
                  </Text>
                  <View className="absolute inset-0 border border-transparent rounded-xl" />
                </TouchableOpacity>
              </View>

              {/* Add Button */}
              <TouchableOpacity
                onPress={handleAddItem}
                className="bg-gradient-to-r from-primary to-primary-container py-5 rounded-xl flex-row items-center justify-center shadow-lg"
              >
                <Text className="text-on-primary font-black text-sm uppercase tracking-[0.3em] mr-3">
                  Add to Shelf
                </Text>
                <Package size={20} className="text-on-primary" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="fixed bottom-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-surface-container/60 backdrop-blur-2xl rounded-t-full border-t border-outline-variant/20">
        {/* Fridge (Active) */}
        <TouchableOpacity className="flex-col items-center justify-center">
          <Package size={24} className="text-primary mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-primary">
            Fridge
          </Text>
        </TouchableOpacity>
        
        {/* Recipes */}
        <TouchableOpacity 
          onPress={() => router.push("/(tabs)/recipes")}
          className="flex-col items-center justify-center opacity-60"
        >
          <Package size={24} className="text-on-surface-variant mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-on-surface-variant">
            Recipes
          </Text>
        </TouchableOpacity>
        
        {/* AI Chef */}
        <TouchableOpacity className="flex-col items-center justify-center opacity-60">
          <Package size={24} className="text-on-surface-variant mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-on-surface-variant">
            AI Chef
          </Text>
        </TouchableOpacity>
        
        {/* Settings */}
        <TouchableOpacity className="flex-col items-center justify-center opacity-60">
          <Package size={24} className="text-on-surface-variant mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-on-surface-variant">
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
