import { identifyFoodFromBase64 } from "@/src/api/geminiApi";
import CameraComponent from "@/src/components/CameraComponent";
import { useFridgeStore } from "@/src/context/fridgeStore";
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
  const [expirationDate, setExpirationDate] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const { addItem } = useFridgeStore();

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }
    const expDate = expirationDate ? new Date(expirationDate) : undefined;
    addItem({ name: name.trim(), expirationDate: expDate });
    setName("");
    setExpirationDate("");
    router.back();
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
      <TextInput
        className="bg-card text-text p-3 rounded-lg mb-4 border border-border"
        placeholder="Expiration date (YYYY-MM-DD)"
        placeholderTextColor="#888"
        value={expirationDate}
        onChangeText={setExpirationDate}
      />
      <TouchableOpacity
        onPress={handleAdd}
        className="bg-primary p-4 rounded-lg"
      >
        <Text className="text-white text-center font-bold">Add Item</Text>
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
    </View>
  );
}
