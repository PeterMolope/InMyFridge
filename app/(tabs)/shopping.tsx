import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, ShoppingCart, Check, X } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import Colors from '@/constants/Colors';

cssInterop(Plus, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Search, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Filter, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(ShoppingCart, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Check, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(X, { className: { target: 'style', nativeStyleToProp: { color: true } } });

type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchased: boolean;
  image?: string;
};

const mockShoppingItems: ShoppingItem[] = [
  {
    id: '1',
    name: 'Organic Milk',
    category: 'Dairy',
    quantity: 1,
    unit: 'gallon',
    purchased: false,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Fresh Salmon',
    category: 'Protein',
    quantity: 2,
    unit: 'lbs',
    purchased: false,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Avocados',
    category: 'Produce',
    quantity: 4,
    unit: 'pieces',
    purchased: true,
    image: 'https://images.unsplash.com/photo-1523049673856-3888e81c8b31?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '4',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'loaf',
    purchased: false,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    category: 'Dairy',
    quantity: 3,
    unit: 'cups',
    purchased: true,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '6',
    name: 'Cherry Tomatoes',
    category: 'Produce',
    quantity: 2,
    unit: 'pints',
    purchased: false,
    image: 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400&auto=format&fit=crop&q=60',
  },
];

export default function ShoppingScreen() {
  const [items, setItems] = useState(mockShoppingItems);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'purchased' | 'unpurchased'>('all');

  const filteredItems = items.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'purchased') return item.purchased;
    if (selectedFilter === 'unpurchased') return !item.purchased;
    return true;
  });

  const togglePurchased = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const stats = {
    total: items.length,
    purchased: items.filter(i => i.purchased).length,
    unpurchased: items.filter(i => !i.purchased).length,
  };

  const getCategoryItems = (category: string) => {
    return filteredItems.filter(item => item.category === category);
  };

  return (
    <SafeAreaView className="flex-1 bg-abyss-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-neon-green/60 text-sm">Shopping List</Text>
            <Text className="text-2xl font-bold text-white tracking-tighter">Groceries</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 glass-card rounded-2xl p-4 neon-border">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 rounded-full bg-neon-green" />
              <Text className="text-xs text-white/60">Total Items</Text>
            </View>
            <Text className="text-2xl font-bold text-white">{stats.total}</Text>
          </View>
          <View className="flex-1 glass-card rounded-2xl p-4 neon-border">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 rounded-full bg-orange-500" />
              <Text className="text-xs text-white/60">To Buy</Text>
            </View>
            <Text className="text-2xl font-bold text-white">{stats.unpurchased}</Text>
          </View>
          <View className="flex-1 glass-card rounded-2xl p-4 neon-border">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-2 h-2 rounded-full bg-green-500" />
              <Text className="text-xs text-white/60">Purchased</Text>
            </View>
            <Text className="text-2xl font-bold text-white">{stats.purchased}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-3 mb-4">
          <View className="flex-1 flex-row items-center glass-card rounded-xl px-4 py-3 gap-3">
            <Search className="text-white/60" size={20} />
            <Text className="text-white/60 flex-1">Search items...</Text>
          </View>
          <TouchableOpacity className="glass-card rounded-xl p-3 neon-border">
            <Filter className="text-white" size={20} />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {(['all', 'unpurchased', 'purchased'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === filter
                    ? 'bg-neon-green'
                    : 'glass-card neon-border'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedFilter === filter
                      ? 'text-black'
                      : 'text-white'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Shopping List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128, gap: 12 }}
      >
        {['PRODUCE', 'PROTEIN', 'DAIRY', 'BAKERY', 'OTHER'].map((category) => {
          const categoryItems = getCategoryItems(category);
          if (categoryItems.length === 0) return null;
          
          return (
            <View key={category}>
              {/* Category Header */}
              <View className="flex-row items-center gap-4 py-2">
                <Text className="text-[10px] font-bold text-neon-green tracking-widest">
                  {category} [{categoryItems.length}]
                </Text>
                <View className="h-[1px] flex-1 bg-white/20" />
              </View>
              
              {/* Category Items */}
              {categoryItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className={`glass-card rounded-2xl overflow-hidden neon-border mb-3 ${
                    item.purchased ? 'opacity-60' : ''
                  }`}
                >
                  <View className="flex-row items-center p-4">
                    <TouchableOpacity
                      onPress={() => togglePurchased(item.id)}
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        item.purchased 
                          ? 'bg-neon-green border-neon-green' 
                          : 'border-white/40'
                      }`}
                    >
                      {item.purchased && (
                        <Check className="text-black" size={16} />
                      )}
                    </TouchableOpacity>
                    
                    <Image
                      source={{ uri: item.image || 'https://via.placeholder.com/60' }}
                      className="w-12 h-12 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                    
                    <View className="flex-1">
                      <Text className={`text-lg font-semibold mb-1 ${
                        item.purchased ? 'text-white/60 line-through' : 'text-white'
                      }`}>
                        {item.name}
                      </Text>
                      <Text className="text-sm text-white/60">
                        {item.quantity} {item.unit} · {item.category}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      className="p-2"
                    >
                      <X className="text-red-500" size={20} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {filteredItems.length === 0 && (
          <View className="items-center py-12">
            <ShoppingCart className="text-white/60 mb-4" size={48} />
            <Text className="text-lg font-semibold text-white mb-2">
              No items found
            </Text>
            <Text className="text-white/60 text-center">
              {selectedFilter === 'all' 
                ? 'Start adding items to your shopping list!'
                : `No ${selectedFilter} items found`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-32 right-6 bg-neon-green rounded-full p-4 shadow-lg shadow-neon-green/30">
        <Plus className="text-black" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
