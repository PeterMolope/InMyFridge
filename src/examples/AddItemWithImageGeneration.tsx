import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, Plus } from 'lucide-react-native';
import { useFridgeStore } from '../context/fridgeStore';
import { generateFridgeAsset } from '../services/imageGenerator';
import QuantityExpiryModal from '../components/QuantityExpiryModal';
import { useNeonTheme } from '../theme/NeonTheme';

/**
 * Example component showing how to integrate image generation with the add-item workflow
 * This demonstrates the recommended pattern for triggering AI image generation when users add items
 */
export const AddItemWithImageGeneration: React.FC = () => {
  const { theme } = useNeonTheme();
  const addItem = useFridgeStore((state) => state.addItem);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Example ingredient list - in a real app, this would come from your ingredient selector
  const sampleIngredients = [
    'Apple', 'Banana', 'Milk', 'Bread', 'Cheese', 
    'Tomato', 'Chicken', 'Rice', 'Pasta', 'Eggs'
  ];

  /**
   * Handles the complete add item workflow with AI image generation
   */
  const handleAddItem = async (ingredientName: string) => {
    setSelectedIngredient(ingredientName);
    setShowModal(true);
  };

  /**
   * Called when user confirms quantity and expiry in the modal
   * This is where we trigger the AI image generation
   */
  const handleModalConfirm = async (quantity: number, expiryDate?: Date) => {
    setIsGeneratingImage(true);
    
    try {
      // Step 1: Generate AI image for the food item
      const imageResult = await generateFridgeAsset(selectedIngredient);
      
      if (imageResult.error) {
        // Show warning but continue with fallback icon
        Alert.alert(
          'Image Generation Warning', 
          `Using fallback icon for ${selectedIngredient}. ${imageResult.error}`,
          [{ text: 'OK' }]
        );
      }

      // Step 2: Add item to fridge store with generated/fallback image
      addItem({
        name: selectedIngredient,
        quantity,
        expirationDate: expiryDate,
        category: categorizeItem(selectedIngredient),
        image: imageResult.imageUrl, // AI generated or fallback image
      });

      // Step 3: Show success message
      const cacheStatus = imageResult.isFromCache ? '(cached)' : '(newly generated)';
      Alert.alert(
        'Item Added Successfully',
        `${selectedIngredient} added to fridge with AI image ${cacheStatus}`
      );

    } catch (error) {
      console.error('Failed to add item:', error);
      Alert.alert(
        'Error',
        'Failed to add item. Please try again.'
      );
    } finally {
      setIsGeneratingImage(false);
      setShowModal(false);
      setSelectedIngredient('');
    }
  };

  /**
   * Simple categorization function - enhance this based on your needs
   */
  const categorizeItem = (itemName: string): string => {
    const categories: Record<string, string[]> = {
      'Fruits': ['apple', 'banana', 'orange', 'grape', 'strawberry'],
      'Vegetables': ['tomato', 'carrot', 'lettuce', 'potato', 'onion'],
      'Dairy': ['milk', 'cheese', 'yogurt', 'butter'],
      'Proteins': ['chicken', 'beef', 'fish', 'egg', 'pork'],
      'Grains': ['bread', 'rice', 'pasta', 'cereal'],
    };

    const lowerName = itemName.toLowerCase();
    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => lowerName.includes(item))) {
        return category;
      }
    }
    return 'Other';
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
      <Text style={{ 
        color: theme.colors.text, 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20 
      }}>
        Add Items to Fridge
      </Text>

      <Text style={{ 
        color: theme.colors.textSecondary, 
        fontSize: 16, 
        marginBottom: 30 
      }}>
        Tap an item to add it with AI-generated images
      </Text>

      {/* Sample Ingredients Grid */}
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
        marginBottom: 30 
      }}>
        {sampleIngredients.map((ingredient) => (
          <TouchableOpacity
            key={ingredient}
            onPress={() => handleAddItem(ingredient)}
            disabled={isGeneratingImage}
            style={{
              width: '48%',
              backgroundColor: theme.colors.glass,
              borderWidth: 1,
              borderColor: theme.colors.glassBorder,
              borderRadius: theme.borderRadius.lg,
              padding: 15,
              marginBottom: 10,
              alignItems: 'center',
              opacity: isGeneratingImage ? 0.6 : 1,
            }}
          >
            <Text style={{ 
              color: theme.colors.text, 
              fontSize: 16, 
              fontWeight: '600',
              textAlign: 'center',
              textTransform: 'capitalize'
            }}>
              {ingredient}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Add Button */}
      <TouchableOpacity
        onPress={() => handleAddItem('Custom Item')}
        disabled={isGeneratingImage}
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadius.lg,
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isGeneratingImage ? 0.6 : 1,
        }}
      >
        <Plus size={20} color="white" />
        <Text style={{ 
          color: 'white', 
          fontSize: 16, 
          fontWeight: 'bold',
          marginLeft: 10 
        }}>
          Add Custom Item
        </Text>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {isGeneratingImage && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: theme.colors.glass,
            padding: 20,
            borderRadius: theme.borderRadius.lg,
            alignItems: 'center',
          }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ 
              color: theme.colors.text, 
              fontSize: 16, 
              marginTop: 10 
            }}>
              Generating AI Image...
            </Text>
            <Text style={{ 
              color: theme.colors.textSecondary, 
              fontSize: 14, 
              marginTop: 5 
            }}>
              Creating studio photo for {selectedIngredient}
            </Text>
          </View>
        </View>
      )}

      {/* Quantity & Expiry Modal */}
      <QuantityExpiryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
        ingredientName={selectedIngredient}
      />
    </View>
  );
};

export default AddItemWithImageGeneration;
