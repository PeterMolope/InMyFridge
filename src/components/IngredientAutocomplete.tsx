import axios from 'axios';
import debounce from 'lodash.debounce';
import { Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Ingredient {
  id: number;
  name: string;
  image?: string;
}

interface IngredientAutocompleteProps {
  onIngredientSelect: (ingredient: Ingredient) => void;
  placeholder?: string;
  className?: string;
}

const IngredientAutocomplete: React.FC<IngredientAutocompleteProps> = ({
  onIngredientSelect,
  placeholder = "Search ingredients...",
  className = "",
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // In a production app, this should be stored securely
  // For demo purposes, we'll use environment variables or secure storage
  const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;
  const API_BASE_URL = 'https://api.spoonacular.com/food/ingredients/autocomplete';

  const searchIngredients = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          query: searchQuery,
          number: 10,
          apiKey: API_KEY,
          metaInformation: true,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setSuggestions(response.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching ingredients:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    searchIngredients(query);
  }, [query]);

  const handleInputChange = (text: string) => {
    setQuery(text);
  };

  const handleIngredientSelect = (ingredient: Ingredient) => {
    onIngredientSelect(ingredient);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const renderSuggestion = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      onPress={() => handleIngredientSelect(item)}
      className="p-3 border-b border-gray-200 bg-white"
    >
      <Text className="text-text text-base capitalize">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className={`relative ${className}`}>
      {/* Search Input */}
      <View className="flex-row items-center bg-card border border-border rounded-lg px-3 py-2">
        <Search size={20} color="#6B7280" />
        <TextInput
          value={query}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 ml-2 text-text"
          onFocus={() => setShowSuggestions(true)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="ml-2">
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View className="absolute top-12 left-0 right-0 bg-card border border-border rounded-lg p-3 z-10">
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text className="text-secondary text-sm mt-2 text-center">Searching...</Text>
        </View>
      )}

      {/* Suggestions List */}
      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <View className="absolute top-12 left-0 right-0 bg-card border border-border rounded-lg z-10 max-h-48 shadow-lg">
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* No Results */}
      {showSuggestions && !isLoading && query.length >= 2 && suggestions.length === 0 && (
        <View className="absolute top-12 left-0 right-0 bg-card border border-border rounded-lg p-3 z-10">
          <Text className="text-secondary text-center">No ingredients found</Text>
        </View>
      )}
    </View>
  );
};

export default IngredientAutocomplete;
