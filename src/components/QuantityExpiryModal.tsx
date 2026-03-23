import { Calendar, Minus, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DateTimePicker from 'react-native-date-picker';

interface QuantityExpiryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (quantity: number, expiryDate?: Date) => void;
  ingredientName: string;
}

const QuantityExpiryModal: React.FC<QuantityExpiryModalProps> = ({
  visible,
  onClose,
  onConfirm,
  ingredientName,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customQuantity, setCustomQuantity] = useState('');
  const [useCustomQuantity, setUseCustomQuantity] = useState(false);

  const incrementQuantity = () => {
    if (useCustomQuantity) {
      const current = parseInt(customQuantity) || 0;
      setCustomQuantity((current + 1).toString());
    } else {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (useCustomQuantity) {
      const current = parseInt(customQuantity) || 0;
      if (current > 1) {
        setCustomQuantity((current - 1).toString());
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  const handleConfirm = () => {
    const finalQuantity = useCustomQuantity ? (parseInt(customQuantity) || 1) : quantity;
    
    if (finalQuantity < 1) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    onConfirm(finalQuantity, expiryDate);
    // Reset state for next use
    setQuantity(1);
    setCustomQuantity('');
    setUseCustomQuantity(false);
    setExpiryDate(new Date());
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setQuantity(1);
    setCustomQuantity('');
    setUseCustomQuantity(false);
    setExpiryDate(new Date());
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card m-4 p-6 rounded-2xl w-full max-w-sm shadow-lg">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-text text-xl font-bold">Add Details</Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Ingredient Name */}
          <Text className="text-text text-lg mb-4 capitalize">{ingredientName}</Text>

          {/* Quantity Section */}
          <View className="mb-6">
            <Text className="text-text font-semibold mb-3">How many?</Text>
            
            {/* Quick Quantity Options */}
            <View className="flex-row gap-2 mb-3">
              {[1, 2, 3, 5, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => {
                    setQuantity(num);
                    setUseCustomQuantity(false);
                    setCustomQuantity('');
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    !useCustomQuantity && quantity === num
                      ? 'bg-primary border-primary'
                      : 'bg-card border-border'
                  }`}
                >
                  <Text
                    className={`${
                      !useCustomQuantity && quantity === num
                        ? 'text-white'
                        : 'text-text'
                    } font-medium`}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Quantity */}
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => setUseCustomQuantity(true)}
                className={`px-3 py-2 rounded-lg border ${
                  useCustomQuantity
                    ? 'bg-primary border-primary'
                    : 'bg-card border-border'
                }`}
              >
                <Text
                  className={`${
                    useCustomQuantity ? 'text-white' : 'text-text'
                  } font-medium`}
                >
                  Custom:
                </Text>
              </TouchableOpacity>
              
              {useCustomQuantity && (
                <View className="flex-1 flex-row items-center bg-card border border-border rounded-lg px-3 py-2">
                  <TouchableOpacity onPress={decrementQuantity}>
                    <Minus size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <TextInput
                    value={customQuantity}
                    onChangeText={setCustomQuantity}
                    keyboardType="numeric"
                    placeholder="1"
                    className="flex-1 text-center text-text"
                  />
                  <TouchableOpacity onPress={incrementQuantity}>
                    <Plus size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Expiry Date Section */}
          <View className="mb-6">
            <Text className="text-text font-semibold mb-3">When does it expire?</Text>
            
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between bg-card border border-border rounded-lg px-4 py-3"
            >
              <View className="flex-row items-center">
                <Calendar size={20} color="#6B7280" />
                <Text className="text-text ml-3">
                  {expiryDate ? formatDateForDisplay(expiryDate) : 'Select expiry date'}
                </Text>
              </View>
              <Text className="text-secondary text-sm">Optional</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-gray-200 p-3 rounded-lg"
            >
              <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              className="flex-1 bg-primary p-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Add to Fridge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          date={expiryDate || new Date()}
          mode="date"
          onDateChange={(date: Date) => {
            setExpiryDate(date);
            setShowDatePicker(false);
          }}
          minimumDate={new Date()}
          title="Select expiry date"
          confirmText="Confirm"
          cancelText="Cancel"
          theme="light"
        />
      )}
    </Modal>
  );
};

export default QuantityExpiryModal;
