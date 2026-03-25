import { FoodItem, useFridgeStore } from "@/src/context/fridgeStore";
import { router } from "expo-router";
import { Brain, Camera, Package, Settings, UtensilsCrossed, X } from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Enable className styling for icons
cssInterop(Camera, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Package, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Brain, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(UtensilsCrossed, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Settings, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(X, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export default function FridgeScreen() {
  const { items, removeItem, selectedItems, toggleSelectItem } = useFridgeStore();

  const handleEat = (id: string) => {
    console.log(`Item ${id} marked as eaten`);
    removeItem(id);
  };

  const handleGetRecipes = () => {
    if (selectedItems.length === 0) {
      alert("Please select some ingredients first");
      return;
    }
    router.push({ pathname: "/(tabs)/recipes" });
  };

  const getCategoryCount = (category: string) => {
    return items.filter(item => item.category === category).length;
  };

  const getCategoryItems = (category: string) => {
    return items.filter(item => item.category === category);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "No expiry";
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    }).toUpperCase();
  };

  const isExpiringSoon = (date?: Date) => {
    if (!date) return false;
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  const renderFoodItem = (item: FoodItem) => (
    <View className="glass-card neon-border rounded-xl p-4 flex-row items-center gap-4 mb-4">
      <View className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/20">
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            className="w-full h-full object-cover"
          />
        ) : (
          <View className="w-full h-full bg-surface-variant/50 flex items-center justify-center">
            <Package size={24} className="text-on-surface-variant/50" />
          </View>
        )}
      </View>
      <View className="flex-grow">
        <View className="flex-row justify-between items-start">
          <Text className="font-bold text-lg text-on-surface tracking-tight capitalize">
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => toggleSelectItem(item.id)}
            className="w-5 h-5 border border-primary/40 rounded-sm bg-transparent flex items-center justify-center"
          >
            {selectedItems.includes(item.id) && (
              <View className="w-full h-full bg-primary rounded-sm flex items-center justify-center">
                <Text className="text-xs text-on-primary font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-3 mt-1">
          <View className="px-2 py-0.5 bg-secondary-container/30 rounded-full border border-secondary/20">
            <Text className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              {item.category || 'OTHER'}
            </Text>
          </View>
          <Text className={`text-[9px] font-bold self-center ${
            isExpiringSoon(item.expirationDate) ? 'text-error' : 'text-on-surface-variant'
          }`}>
            EXP: {formatDate(item.expirationDate)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-surface-container-lowest">
      {/* Top Navigation */}
      <View className="fixed top-0 w-full flex-row justify-between items-center px-6 py-4 bg-black/40 z-50">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30">
            <Image 
              source={{ uri: 'https://via.placeholder.com/40' }} 
              className="w-full h-full object-cover"
            />
          </View>
          <Text className="text-xl font-bold text-primary tracking-[0.2em] uppercase">
            InMyFridge
          </Text>
        </View>
        <TouchableOpacity className="w-10 h-10 flex items-center justify-center text-primary">
          <Camera size={24} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView className="pt-24 pb-32 px-6" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="mb-10">
          <View className="flex-row justify-between items-end mb-4">
            <View>
              <Text className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                Current Inventory
              </Text>
              <Text className="text-4xl font-bold tracking-tighter text-on-surface">
                Virtual Shelf
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {items.length} Items Total
              </Text>
              <View className="h-1 w-24 bg-surface-variant mt-2 rounded-full overflow-hidden">
                <View className="h-full bg-primary w-3/4 shadow-lg shadow-primary/50" />
              </View>
            </View>
          </View>
        </View>

        {/* Search Terminal */}
        <View className="relative mb-8">
          <View className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Text className="text-on-surface-variant text-sm">🔍</Text>
          </View>
          <TextInput
            placeholder="QUERY DATABASE..."
            placeholderTextColor="rgb(var(--outline))"
            className="w-full bg-transparent border-b border-outline/50 py-3 pl-10 text-xs font-bold tracking-widest text-on-surface"
          />
          <View className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary" />
        </View>

        {/* Inventory List */}
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="relative mb-8">
              <Package className="text-muted-foreground" size={120} />
            </View>
            <Text className="text-2xl font-bold mb-2 text-center text-on-surface">
              Your fridge is lonely
            </Text>
            <Text className="text-muted-foreground text-lg mb-8 text-center px-8">
              Start adding ingredients to keep track of your food and get recipe suggestions!
            </Text>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/add-item" })}
              className="bg-primary px-8 py-4 rounded-full flex-row items-center"
            >
              <Text className="text-on-primary font-bold ml-2">Add Your First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {/* Group by category */}
            {['PROTEIN', 'VEGGIES', 'DAIRY', 'FRUITS', 'OTHER'].map((category) => {
              const categoryItems = getCategoryItems(category);
              if (categoryItems.length === 0) return null;
              
              return (
                <View key={category}>
                  {/* Category Header */}
                  <View className="flex-row items-center gap-4 py-2">
                    <Text className="text-[10px] font-bold text-primary-dim tracking-widest">
                      {category} [{categoryItems.length}]
                    </Text>
                    <View className="h-[1px] flex-1 bg-outline-variant/20" />
                  </View>
                  
                  {/* Category Items */}
                  {categoryItems.map(renderFoodItem)}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/add-item" })}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-40"
      >
        <Text className="text-3xl font-bold text-on-primary-fixed">+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View className="fixed bottom-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-surface-container/60 backdrop-blur-2xl rounded-t-3xl border-t border-outline-variant/20">
        {/* Fridge (Active) */}
        <TouchableOpacity className="flex-col items-center justify-center">
          <Package size={24} className="text-primary mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-primary">
            Fridge
          </Text>
        </TouchableOpacity>
        
        {/* Recipes */}
        <TouchableOpacity 
          onPress={handleGetRecipes}
          className="flex-col items-center justify-center opacity-60"
        >
          <UtensilsCrossed size={24} className="text-on-surface-variant mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-on-surface-variant">
            Recipes
          </Text>
        </TouchableOpacity>
        
        {/* AI Chef */}
        <TouchableOpacity className="flex-col items-center justify-center opacity-60">
          <Brain size={24} className="text-on-surface-variant mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-on-surface-variant">
            AI Chef
          </Text>
        </TouchableOpacity>
        
        {/* Settings */}
        <TouchableOpacity className="flex-col items-center justify-center opacity-60">
          <Settings size={24} className="text-on-surface-variant mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-on-surface-variant">
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
