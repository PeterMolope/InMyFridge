import { identifyFoodFromBase64 } from "@/src/api/geminiApi";
import CameraComponent from "@/src/components/CameraComponent";
import { useFridgeStore } from "@/src/context/fridgeStore";
import { generateFridgeAsset } from "@/src/services/imageGenerator";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { addItem } = useFridgeStore();

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      // Generate image for the food item
      const imageResult = await generateFridgeAsset(name.trim());
      
      // Add item with generated image
      addItem({ 
        name: name.trim(), 
        expirationDate,
        image: imageResult.imageUrl
      });
      
      // If there was an error with image generation, show a subtle notification
      if (imageResult.error) {
        console.log('Image generation used fallback:', imageResult.error);
      }
      
      setName("");
      setExpirationDate(undefined);
      router.back();
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert(
        "Error", 
        "Failed to add item. Please try again.",
        [{ text: "OK", onPress: () => {} }]
      );
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePhotoCapture = async (photoUri: string, base64?: string) => {
    setShowCamera(false);
    setIsIdentifying(true);
    
    try {
      if (base64) {
        // Use base64 data directly from camera
        const identification = await identifyFoodFromBase64(base64);
        setName(identification.itemName);
        Alert.alert(
          "Food Identified!", 
          `Identified as: ${identification.itemName}`,
          [{ text: "OK", onPress: () => {} }]
        );
      } else {
        // Fallback: try to get base64 from URI
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const base64Data = result.assets[0].base64;
          if (base64Data) {
            const identification = await identifyFoodFromBase64(base64Data);
            setName(identification.itemName);
            Alert.alert(
              "Food Identified!", 
              `Identified as: ${identification.itemName}`,
              [{ text: "OK", onPress: () => {} }]
            );
          } else {
            Alert.alert("Error", "Could not process image data");
          }
        } else {
          Alert.alert("Error", "Could not process image data");
        }
      }
    } catch (error) {
      console.error('Error identifying food:', error);
      Alert.alert(
        "Identification Failed", 
        "Could not identify the food item. Please enter the name manually.",
        [{ text: "OK", onPress: () => {} }]
      );
    } finally {
      setIsIdentifying(false);
    }
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpirationDate(selectedDate);
    }
  };

  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-text text-2xl font-bold mb-4">
        Add Item to Fridge
      </Text>
      
      <TouchableOpacity
        onPress={openCamera}
        className="bg-primary p-4 rounded-lg mb-4 flex-row justify-center items-center"
        disabled={isIdentifying}
      >
        {isIdentifying ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-white text-center font-bold">📷 Scan Food Item</Text>
        )}
      </TouchableOpacity>
      
      <TextInput
        className="bg-card text-text p-3 rounded-lg mb-4 border border-border"
        placeholder="Item name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        onPress={showDatepicker}
        className="bg-card text-text p-3 rounded-lg mb-4 border border-border flex-row justify-between items-center"
      >
        <Text className={expirationDate ? "text-text" : "text-gray-500"}>
          {formatDateDisplay(expirationDate) || "Select expiration date"}
        </Text>
        <Text className="text-text text-lg">📅</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleAdd}
        className="bg-primary p-4 rounded-lg"
        disabled={isGeneratingImage}
      >
        {isGeneratingImage ? (
          <View className="flex-row justify-center items-center">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white text-center font-bold ml-2">Generating Image...</Text>
          </View>
        ) : (
          <Text className="text-white text-center font-bold">Add Item</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CameraComponent
          onPhotoCapture={handlePhotoCapture}
          onClose={closeCamera}
        />
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={expirationDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}
