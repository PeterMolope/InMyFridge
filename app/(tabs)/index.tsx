import { BentoStatsCard } from '@/src/components/BentoStatsCard';
import { FilterChip } from '@/src/components/FilterChip';
import { FridgeItemCard } from '@/src/components/FridgeItemCard';
import { SearchBar } from '@/src/components/SearchBar';
import { useFridgeStore } from '@/src/context/fridgeStore';
import { THEME } from '@/src/theme/theme';
import { Camera, Plus } from '@/src/utils/icon-interop';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type FilterType = 'all' | 'fresh' | 'expiring' | 'expired';

export default function FridgeScreen() {
  const { items, addItem, removeItem, initializeItems } = useFridgeStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize existing items with proper images
  React.useEffect(() => {
    initializeItems();
  }, [initializeItems]);

  // Calculate stats
  const totalItems = items.length;
  const expiringItems = items.filter(item => {
    if (!item.expirationDate) return false;
    const daysRemaining = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 && daysRemaining <= 3;
  }).length;
  const expiredItems = items.filter(item => {
    if (!item.expirationDate) return false;
    const daysRemaining = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining < 0;
  }).length;

  // Filter items based on selected filter and search
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (!item.expirationDate) return false;
    const daysRemaining = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    switch (activeFilter) {
      case 'fresh':
        return daysRemaining > 3;
      case 'expiring':
        return daysRemaining > 0 && daysRemaining <= 3;
      case 'expired':
        return daysRemaining < 0;
      default:
        return true;
    }
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'fresh', label: 'Fresh' },
    { key: 'expiring', label: 'Expiring' },
    { key: 'expired', label: 'Expired' },
  ];

  const openCamera = () => {
    router.push('/camera' as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.background }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.lg,
        paddingVertical: THEME.spacing.md,
      }}>
        <Text style={{
          color: THEME.text.primary,
          fontSize: 24,
          fontWeight: 'bold',
          fontFamily: 'SpaceMono',
        }}>
          Welcome back, My Fridge
        </Text>
        <TouchableOpacity>
          <Plus size={24} color={THEME.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Bento Stats */}
      <View style={{ 
        flexDirection: 'row', 
        paddingHorizontal: THEME.spacing.lg,
        marginBottom: THEME.spacing.sm,
        gap: 8,
      }}>
        <BentoStatsCard 
          title="Total Items" 
          abbreviation="Total"
          value={totalItems} 
          color={THEME.accent}
        />
        <BentoStatsCard 
          title="Expiring" 
          value={expiringItems} 
          color={THEME.status.expiring}
        />
        <BentoStatsCard 
          title="Expired" 
          value={expiredItems} 
          color={THEME.status.expired}
        />
      </View>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => {}}
      />

      {/* Filter Chips */}
      <View style={{ 
        paddingHorizontal: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
      }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            gap: THEME.spacing.sm,
          }}
        >
          {filters.map(filter => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              isActive={activeFilter === filter.key}
              onPress={() => setActiveFilter(filter.key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Items List */}
      <FlashList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FridgeItemCard
            item={item}
            onAddPress={() => {
              // Handle add to shopping list or other action
            }}
            onDeletePress={(id) => {
              removeItem(id);
            }}
          />
        )}
        contentContainerStyle={{ paddingBottom: THEME.spacing.xxl }}
        ListEmptyComponent={
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: THEME.spacing.xxl,
          }}>
            <Text style={{
              color: THEME.text.secondary,
              fontSize: 18,
              fontFamily: 'SpaceMono',
              textAlign: 'center',
            }}>
              No items found
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={openCamera}
        style={{
          position: 'absolute',
          bottom: THEME.spacing.xl,
          right: THEME.spacing.lg,
          backgroundColor: THEME.accent,
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: THEME.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Camera size={24} color={THEME.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
