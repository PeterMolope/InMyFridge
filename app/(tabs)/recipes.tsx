import { useFridgeStore } from "@/src/context/fridgeStore";
import { router } from "expo-router";
import { ArrowRight, Brain, Camera, Circle, Clock, Package, Settings, Settings2, Star, UtensilsCrossed } from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Enable className styling for icons
cssInterop(Camera, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Package, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Brain, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(UtensilsCrossed, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Settings, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Star, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Clock, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Circle, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(ArrowRight, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Settings2, { className: { target: 'style', nativeStyleToProp: { color: true } } });

// Simplified recipe interface for our design
interface SimpleRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  readyInMinutes?: number;
  servings?: number;
  nutrition?: {
    calories?: number;
  };
}

// Mock recipe data matching the HTML design
const mockRecipes: SimpleRecipe[] = [
  {
    id: 1,
    title: "Cyber-Green Detox Bowl",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEO6D7LkD1XMZb0CiMLnYK3H1IQBNjkiiG6MuHokuDCainVF1up8AyesA_U0NFoYc8tt2AzLGmX7RLYQU2yYSdKcoO1Jr8cM6vwTvMfqOS1GpWJPCagq5hVxHuPhhO1iOmGEYR_vROERwEcRXYb_eVlieDznUbCWRI3EU8lL8C55pNcns5lVgPNnOcw8FnoqE0vSp13pj62f84ebjlzIWhQMcv7M2WTjIjSy2qs-IT0xPP7_v016dlNoJ5aXN9bAwiVA831cU0ZGAR",
    usedIngredientCount: 8,
    missedIngredientCount: 2,
    readyInMinutes: 25,
    servings: 2,
    nutrition: { calories: 320 }
  },
  {
    id: 2,
    title: "Neon Salmon Sear",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbwgSy-jwJo0qgtGi2aqgyp8RXGskJTA7ND201BZLkaSO4M6jugNLocKKYmVlYVpxa3eR7HvYfUewbIoxrr5YDqP_jCflFjiN_DA5Q8Qb693Jy4VUuoH_hNbTXchucjznwtUpH8YQl15xnnT_R-JBfUonDQ2Pb00fbiQ_p6aeRPhvr6_t8eRxbraOfNhCNn7MAhjOO28T2atqq1hirhYgop-YkygKMIuEZ8_Lu1Rsh4HSDdI7Y2AGituA1nGHYFifekekbDdA9xZkj",
    usedIngredientCount: 6,
    missedIngredientCount: 1,
    readyInMinutes: 15,
    servings: 2,
    nutrition: { calories: 420 }
  },
  {
    id: 3,
    title: "Quantum Margherita",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT_p6KmULvqx-1mapwJt0wjhX-vgRgRy3t5PnDAE597yywnKpFaBgruy1BmNw00QH02DJPb87T6HUGmH3RZyYrOVi67M3Y2Z4itDXURfClApYVwQMTWb2pZsFHpgCv5AaoNgJ3-XOlP2KmouaDd-zicb5TyjlPFUsvZ64wW_HgfjcfVPTJyi3_QDlqzNY7utXcyhFJaBLQNNclaPKi6KTvv2QPVwyAGTKKtkyWhodGEH60mZ1rvGoOC0C3bVe3t0__UAUGf3qksmNY",
    usedIngredientCount: 5,
    missedIngredientCount: 3,
    readyInMinutes: 20,
    servings: 4,
    nutrition: { calories: 280 }
  },
  {
    id: 4,
    title: "Kinetic Berry Salad",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALTuMSXb__66-GXLtAJH-JTddDjrllNjXM6eieJ9OKkrV7tR19eyOhDbjzaXJtj4ZL9tvtcjBC4YLM_aXsNL8i96zy_rfFjobMAL8wGgKmgx6AjFcmeIpVTaZ5eILysydXqQpSkqi4YuxB62HwNLNJ3mJEYr_0XNlAgw0pH5_7Rh5F3JZyxfK6fSZD9KmFAZuRqr47IUlbTKYvDOLQ1-lhrTNwVPHPhylFz1Omf_-KHyCvinEhyDQtWGZItZ3itoDWafhdiytb0nCl",
    usedIngredientCount: 4,
    missedIngredientCount: 2,
    readyInMinutes: 10,
    servings: 2,
    nutrition: { calories: 180 }
  },
  {
    id: 5,
    title: "Electric Miso Ramen",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2V4rE3dmhTj09mdSwG1zz-BlG-7nvV1FAsFvBjCdHNbufSgMxSvvMA67vqAsJRC_7bPkY5gZWnYEL0odXJbSCaHJKC5Kdy12SZas85oo-O49RG4ylSGLAoKuWv4Qm7_Jz4UgG_LjV9144FTmqFHve94hCUqvAGHu6Y39ocpZ-jJeid4smOuItOLA-uPJ-DlbenD--1ThN7VAgnGv1gFfFgZnSclirJzzB0vtG62uLJOvg2SmnD7ekLdM0LM1C0ghGmO4h3djz-ay0",
    usedIngredientCount: 7,
    missedIngredientCount: 4,
    readyInMinutes: 35,
    servings: 2,
    nutrition: { calories: 450 }
  }
];

export default function RecipesScreen() {
  const { selectedItems, items } = useFridgeStore();

  const selectedNames = items
    .filter((item) => selectedItems.includes(item.id))
    .map((item) => item.name);

  // Use mock data for now instead of API
  const recipes = mockRecipes;
  const isLoading = false;
  const error = null;

  const renderFeaturedRecipe = (recipe: SimpleRecipe) => (
    <TouchableOpacity 
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      className="md:col-span-8 relative overflow-hidden rounded-xl neon-glass"
    >
      <View className="relative aspect-[16/10] md:aspect-auto md:h-[500px] overflow-hidden">
        <Image 
          source={{ uri: recipe.image }} 
          className="w-full h-full object-cover"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </View>
      <View className="absolute bottom-0 left-0 p-8 w-full">
        <View className="flex-row gap-4 mb-4">
          <View className="flex-row items-center gap-1.5 px-3 py-1 bg-primary/20 backdrop-blur-md rounded-full border border-primary/40">
            <Clock size={14} className="text-primary" />
            <Text className="text-primary text-xs font-bold uppercase tracking-widest">
              {recipe.readyInMinutes}m
            </Text>
          </View>
          <View className="flex-row items-center gap-0.5">
            <Circle size={16} className="text-primary" fill="#8EFF71" />
            <Circle size={16} className="text-primary" fill="#8EFF71" />
            <Circle size={16} className="text-primary" />
          </View>
        </View>
        <Text className="text-3xl font-bold text-primary neon-glow-text mb-2">
          {recipe.title}
        </Text>
        <Text className="text-on-surface-variant max-w-md text-sm line-clamp-2">
          A nutrient-dense fusion of fresh ingredients with cyber-neon presentation.
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSecondaryRecipe = (recipe: SimpleRecipe) => (
    <TouchableOpacity 
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      className="neon-glass rounded-xl overflow-hidden mb-6"
    >
      <View className="h-48 overflow-hidden relative">
        <Image 
          source={{ uri: recipe.image }} 
          className="w-full h-full object-cover"
          resizeMode="cover"
        />
        <View className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded">
          <Text className="text-primary text-[10px] font-black border border-primary/20">
            98% MATCH
          </Text>
        </View>
      </View>
      <View className="p-6">
        <Text className="font-bold text-xl text-primary mb-2">
          {recipe.title}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
            {recipe.readyInMinutes}m prep
          </Text>
          <View className="flex-row gap-1">
            <Star size={12} className="text-primary" fill="#8EFF71" />
            <Star size={12} className="text-primary" fill="#8EFF71" />
            <Star size={12} className="text-primary" fill="#8EFF71" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecipeCard = (recipe: SimpleRecipe) => (
    <TouchableOpacity 
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      className="neon-glass rounded-xl overflow-hidden"
    >
      <View className="h-48 overflow-hidden">
        <Image 
          source={{ uri: recipe.image }} 
          className="w-full h-full object-cover"
          resizeMode="cover"
        />
      </View>
      <View className="p-6">
        <Text className="font-bold text-xl text-primary mb-2">
          {recipe.title}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-on-surface-variant font-bold">
            {recipe.readyInMinutes}m • Easy
          </Text>
          <Text className="text-primary text-xs font-bold">
            {recipe.nutrition?.calories || 300} kcal
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-surface-container-lowest">
        <Text className="text-on-surface">Loading recipes...</Text>
      </View>
    );
  if (error)
    return (
      <View className="flex-1 justify-center items-center bg-surface-container-lowest">
        <Text className="text-error">Error loading recipes</Text>
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
        {/* Hero Header */}
        <View className="flex-row justify-between items-end mb-12">
          <View>
            <Text className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">
              Engine Output
            </Text>
            <Text className="text-4xl font-bold tracking-tighter text-on-surface">
              Recipe Results
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center gap-2 px-5 py-2 rounded-xl bg-surface-variant/20 border border-primary/30">
            <Settings2 size={14} className="text-primary" />
            <Text className="text-primary text-xs font-bold uppercase tracking-widest">
              Refine
            </Text>
          </TouchableOpacity>
        </View>

        {selectedNames.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <UtensilsCrossed size={120} className="text-muted-foreground mb-8" />
            <Text className="text-2xl font-bold mb-2 text-center text-on-surface">
              No ingredients selected
            </Text>
            <Text className="text-muted-foreground text-lg mb-8 text-center px-8">
              Select ingredients in the Fridge tab to get recipe suggestions!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("../")}
              className="bg-primary px-8 py-4 rounded-full"
            >
              <Text className="text-on-primary font-bold">Go to Fridge</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-6">
            {/* Bento Grid Layout */}
            <View className="grid grid-cols-1 gap-6">
              {/* Main Featured Recipe */}
              {recipes[0] && renderFeaturedRecipe(recipes[0])}

              {/* Side Column */}
              <View className="grid grid-cols-1 gap-6 mt-6">
                {/* Secondary Recipe */}
                {recipes[1] && renderSecondaryRecipe(recipes[1])}

                {/* AI Chef Insight Box */}
                <View className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <Brain size={24} className="text-primary mb-4" />
                  <Text className="font-bold text-on-surface text-lg mb-2">
                    Chef's Note
                  </Text>
                  <Text className="text-sm text-on-surface-variant leading-relaxed mb-6">
                    Based on your <Text className="text-primary font-bold">{selectedNames.slice(0, 2).join(", ")}</Text> levels, I suggest the Detox Bowl for maximum efficiency.
                  </Text>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="text-primary text-xs font-bold uppercase tracking-widest">
                      Ask Chef why
                    </Text>
                    <ArrowRight size={12} className="text-primary" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Row */}
              <View className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {recipes.slice(2).map(renderRecipeCard)}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="fixed right-6 bottom-28 w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-40"
      >
        <Text className="text-3xl font-bold text-on-primary-fixed">+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View className="fixed bottom-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-surface-container/60 backdrop-blur-2xl rounded-t-3xl border-t border-outline-variant/20">
        {/* Fridge */}
        <TouchableOpacity 
          onPress={() => router.push("/")}
          className="flex-col items-center justify-center opacity-60"
        >
          <Package size={24} className="text-on-surface-variant mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-on-surface-variant">
            Fridge
          </Text>
        </TouchableOpacity>
        
        {/* Recipes (Active) */}
        <TouchableOpacity className="flex-col items-center justify-center">
          <UtensilsCrossed size={24} className="text-primary mb-1" />
          <Text className="text-[10px] uppercase tracking-[0.1em] font-medium text-primary">
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
