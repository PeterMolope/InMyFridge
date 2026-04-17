import { FilterChip } from '@/src/components/FilterChip';
import { RecipeCard } from '@/src/components/RecipeCard';
import { SearchBar } from '@/src/components/SearchBar';
import { useFridgeStore } from '@/src/context/fridgeStore';
import { THEME } from '@/src/theme/theme';
import { Plus, Settings } from '@/src/utils/icon-interop';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

// Mock recipe data - replace with actual API call
const mockRecipes = [
  {
    id: '1',
    title: 'Grilled Chicken Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    rating: 4.8,
    difficulty: 'Easy' as const,
    cookTime: '25 min',
    calories: 350,
    matchPercentage: 50,
    ingredientsMatched: 4,
    totalIngredients: 8,
    tags: ['Healthy', 'Low-Carb'],
  },
  {
    id: '2',
    title: 'Pasta Carbonara',
    image: 'https://images.unsplash.com/photo-1603070449042-7932a4f8dfc5?w=400',
    rating: 4.6,
    difficulty: 'Medium' as const,
    cookTime: '30 min',
    calories: 520,
    matchPercentage: 75,
    ingredientsMatched: 6,
    totalIngredients: 8,
    tags: ['Italian', 'Quick'],
  },
  {
    id: '3',
    title: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510ba2e191?w=400',
    rating: 4.4,
    difficulty: 'Easy' as const,
    cookTime: '15 min',
    calories: 280,
    matchPercentage: 60,
    ingredientsMatched: 3,
    totalIngredients: 5,
    tags: ['Vegetarian', 'Healthy'],
  },
];

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
type TagFilter = 'all-tags' | 'healthy' | 'low-carb' | 'vegetarian';

export default function RecipesScreen() {
  const { items } = useFridgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [tagFilter, setTagFilter] = useState<TagFilter>('all-tags');

  // Filter recipes based on search and filters
  const filteredRecipes = mockRecipes.filter(recipe => {
    // Search filter
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      if (recipe.difficulty.toLowerCase() !== difficultyFilter) {
        return false;
      }
    }

    // Tag filter
    if (tagFilter !== 'all-tags') {
      if (!recipe.tags.some(tag => tag.toLowerCase() === tagFilter.replace('-', ' '))) {
        return false;
      }
    }

    return true;
  });

  const difficultyFilters: { key: DifficultyFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ];

  const tagFilters: { key: TagFilter; label: string }[] = [
    { key: 'all-tags', label: 'All Tags' },
    { key: 'healthy', label: 'Healthy' },
    { key: 'low-carb', label: 'Low-Carb' },
    { key: 'vegetarian', label: 'Vegetarian' },
  ];

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
          Discover Recipes
        </Text>
        <TouchableOpacity>
          <Settings size={24} color={THEME.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => {}}
      />

      {/* Difficulty Filters */}
      <View style={{ 
        flexDirection: 'row', 
        paddingHorizontal: THEME.spacing.lg,
        marginBottom: THEME.spacing.sm,
      }}>
        {difficultyFilters.map(filter => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            isActive={difficultyFilter === filter.key}
            onPress={() => setDifficultyFilter(filter.key)}
          />
        ))}
      </View>

      {/* Tag Filters */}
      <View style={{ 
        flexDirection: 'row', 
        paddingHorizontal: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
      }}>
        {tagFilters.map(filter => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            isActive={tagFilter === filter.key}
            onPress={() => setTagFilter(filter.key)}
          />
        ))}
      </View>

      {/* Recipes List */}
      <FlashList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            {...item}
            onPress={() => router.push(`/recipe/${item.id}`)}
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
              No recipes found
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push('/add-item')}
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
        <Plus size={24} color={THEME.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
