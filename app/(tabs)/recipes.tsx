import { useFridgeStore } from "@/src/context/fridgeStore";
import { ChefHat, Clock, Flame, Leaf, Search, Star } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(Search, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Clock, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Star, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(ChefHat, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Leaf, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Flame, { className: { target: 'style', nativeStyleToProp: { color: true } } });

type Recipe = {
  id: string;
  name: string;
  image: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  matchedIngredients: number;
  totalIngredients: number;
  calories: number;
  tags: string[];
};

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Cyber-Green Detox Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
    cookingTime: 25,
    difficulty: 'Easy',
    rating: 4.8,
    matchedIngredients: 4,
    totalIngredients: 8,
    calories: 350,
    tags: ['Healthy', 'Low-Carb'],
  },
  {
    id: '2',
    name: 'Neon Salmon Sear',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=60',
    cookingTime: 15,
    difficulty: 'Easy',
    rating: 4.5,
    matchedIngredients: 3,
    totalIngredients: 6,
    calories: 420,
    tags: ['High-Protein', 'Quick'],
  },
  {
    id: '3',
    name: 'Quantum Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=60',
    cookingTime: 5,
    difficulty: 'Easy',
    rating: 4.7,
    matchedIngredients: 2,
    totalIngredients: 5,
    calories: 220,
    tags: ['Breakfast', 'Healthy'],
  },
  {
    id: '4',
    name: 'Electric Omelette',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=60',
    cookingTime: 15,
    difficulty: 'Easy',
    rating: 4.6,
    matchedIngredients: 3,
    totalIngredients: 6,
    calories: 320,
    tags: ['Breakfast', 'High-Protein'],
  },
  {
    id: '5',
    name: 'Kinetic Stir Fry',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=60',
    cookingTime: 30,
    difficulty: 'Medium',
    rating: 4.9,
    matchedIngredients: 3,
    totalIngredients: 10,
    calories: 280,
    tags: ['Asian', 'Dinner'],
  },
  {
    id: '6',
    name: 'Plasma Power Bowl',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=60',
    cookingTime: 10,
    difficulty: 'Easy',
    rating: 4.4,
    matchedIngredients: 2,
    totalIngredients: 7,
    calories: 290,
    tags: ['Vegan', 'Quick'],
  },
];

export default function RecipesScreen() {
  const { selectedItems, items } = useFridgeStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const selectedNames = items
    .filter((item) => selectedItems.includes(item.id))
    .map((item) => item.name);

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesDifficulty = selectedFilter === 'all' || recipe.difficulty.toLowerCase() === selectedFilter;
    const matchesTag = !selectedTag || recipe.tags.includes(selectedTag);
    return matchesDifficulty && matchesTag;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-orange-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMatchPercentage = (matched: number, total: number) => {
    return Math.round((matched / total) * 100);
  };

  const allTags = Array.from(new Set(mockRecipes.flatMap(r => r.tags)));

  return (
    <SafeAreaView 
      style={{
        flex: 1,
        backgroundColor: '#050505'
      }}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24
        }}>
          <View>
            <Text style={{ color: '#39FF14', opacity: 0.6, fontSize: 14 }}>Discover</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff', letterSpacing: -1 }}>Recipes</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
          borderWidth: 1,
          borderColor: 'rgba(57, 255, 20, 0.3)',
          marginBottom: 16
        }}>
          <Search color="rgba(255, 255, 255, 0.6)" size={20} />
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', flex: 1 }}>Search recipes...</Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ gap: 8 }}
        >
          <View style={{
            flexDirection: 'row',
            gap: 8
          }}>
            {(['all', 'easy', 'medium', 'hard'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedFilter === filter ? '#39FF14' : 'rgba(26, 26, 26, 0.8)',
                  borderWidth: 1,
                  borderColor: 'rgba(57, 255, 20, 0.3)'
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: selectedFilter === filter ? '#000000' : '#ffffff'
                  }}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Tags */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ gap: 8 }}
        >
          <View style={{
            flexDirection: 'row',
            gap: 8
          }}>
            <TouchableOpacity
              onPress={() => setSelectedTag(null)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: !selectedTag ? '#39FF14' : 'rgba(26, 26, 26, 0.8)',
                borderWidth: 1,
                borderColor: 'rgba(57, 255, 20, 0.3)'
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: !selectedTag ? '#000000' : '#ffffff'
                }}
              >
                All Tags
              </Text>
            </TouchableOpacity>
            {allTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => setSelectedTag(tag)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: selectedTag === tag ? '#39FF14' : 'rgba(26, 26, 26, 0.8)',
                  borderWidth: 1,
                  borderColor: 'rgba(57, 255, 20, 0.3)'
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: selectedTag === tag ? '#000000' : '#ffffff'
                  }}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Recipe Cards */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128, gap: 16 }}
      >
        {selectedNames.length === 0 ? (
          <View style={{
            alignItems: 'center',
            paddingVertical: 48
          }}>
            <ChefHat color="rgba(255, 255, 255, 0.6)" size={48} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 8 }}>
              No ingredients selected
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
              Select ingredients in the Fridge tab to get personalized recipe suggestions!
            </Text>
          </View>
        ) : (
          filteredRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(57, 255, 20, 0.3)'
              }}
            >
              <Image
                source={{ uri: recipe.image }}
                style={{
                  width: '100%',
                  height: 160
                }}
                resizeMode="cover"
              />
              <View style={{ padding: 16 }}>
                {/* Header */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 8
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 4 }}>
                      {recipe.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Star color="#EAB308" size={14} fill="#EAB308" />
                      <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}>
                        {recipe.rating} · {recipe.difficulty}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    backgroundColor: recipe.difficulty === 'Easy' ? '#22c55e' : recipe.difficulty === 'Medium' ? '#f97316' : '#ef4444',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 20
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#ffffff' }}>
                      {recipe.difficulty}
                    </Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Clock color="rgba(255, 255, 255, 0.6)" size={16} />
                    <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}>
                      {recipe.cookingTime} min
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Flame color="rgba(255, 255, 255, 0.6)" size={16} />
                    <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}>
                      {recipe.calories} cal
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <Leaf color="#39FF14" size={16} />
                    <Text style={{ fontSize: 14, color: '#39FF14', fontWeight: '500' }}>
                      {getMatchPercentage(recipe.matchedIngredients, recipe.totalIngredients)}% match
                    </Text>
                  </View>
                </View>

                {/* Ingredients Match */}
                <View style={{
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12
                }}>
                  <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 4 }}>
                    You have {recipe.matchedIngredients} of {recipe.totalIngredients} ingredients
                  </Text>
                  <View style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 6,
                    height: 6
                  }}>
                    <View
                      style={{
                        backgroundColor: '#39FF14',
                        height: 6,
                        borderRadius: 3,
                        width: `${getMatchPercentage(recipe.matchedIngredients, recipe.totalIngredients)}%`
                      }}
                    />
                  </View>
                </View>

                {/* Tags */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8
                }}>
                  {recipe.tags.map((tag) => (
                    <View key={tag} style={{
                      backgroundColor: 'rgba(26, 26, 26, 0.8)',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: 'rgba(57, 255, 20, 0.3)'
                    }}>
                      <Text style={{ fontSize: 12, color: '#ffffff' }}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {filteredRecipes.length === 0 && selectedNames.length > 0 && (
          <View style={{
            alignItems: 'center',
            paddingVertical: 48
          }}>
            <ChefHat color="rgba(255, 255, 255, 0.6)" size={48} />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 8 }}>
              No recipes found
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
              Try adjusting your filters or search terms
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
