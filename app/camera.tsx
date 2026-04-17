import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RecognizedItem {
  name: string;
  category: string;
  confidence: number;
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  // Request camera permissions on mount
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Mock AI processing function
  const mockAIProcessing = async (imageUri: string): Promise<RecognizedItem> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock recognized items with some variety
    const mockItems = [
      { name: 'Apple', category: 'Fruits', confidence: 0.95 },
      { name: 'Milk', category: 'Dairy', confidence: 0.89 },
      { name: 'Bread', category: 'Bakery', confidence: 0.92 },
      { name: 'Tomato', category: 'Vegetables', confidence: 0.87 },
      { name: 'Chicken', category: 'Meat', confidence: 0.94 },
      { name: 'Yogurt', category: 'Dairy', confidence: 0.91 },
      { name: 'Carrot', category: 'Vegetables', confidence: 0.88 },
      { name: 'Cheese', category: 'Dairy', confidence: 0.93 },
    ];
    
    return mockItems[Math.floor(Math.random() * mockItems.length)];
  };

  const handleSnap = async () => {
    if (!cameraRef.current || !cameraReady || isProcessing) return;

    setIsProcessing(true);
    
    try {
      // Take the picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      if (photo.uri) {
        // Show processing indicator
        console.log('Photo captured, processing with AI...');
        
        // Mock AI processing
        const recognizedItem = await mockAIProcessing(photo.uri);
        
        console.log('AI Recognition complete:', recognizedItem);
        
        // Navigate to add-item screen with pre-filled data
        router.push({
          pathname: '/add-item',
          params: {
            name: recognizedItem.name,
            category: recognizedItem.category,
            confidence: recognizedItem.confidence.toString(),
            imageUri: photo.uri,
          }
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (permission === null) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.permissionButton, styles.cancelButton]} onPress={handleClose}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        ratio="16:9"
        onCameraReady={() => setCameraReady(true)}
        facing="back"
      />
      
      {/* Dark overlay for neon theme */}
      <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#8eff71" />
              <Text style={styles.processingText}>AI Processing...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.snapButton, !cameraReady && styles.snapButtonDisabled]}
              onPress={handleSnap}
              disabled={!cameraReady || isProcessing}
            >
              <Text style={styles.snapButtonText}>SNAP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  message: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  bottomControls: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  snapButton: {
    backgroundColor: '#8eff71',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#8eff71',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  snapButtonDisabled: {
    backgroundColor: '#333333',
    shadowOpacity: 0,
    elevation: 0,
  },
  snapButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  processingContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  processingText: {
    color: '#8eff71',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  permissionButton: {
    backgroundColor: '#8eff71',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: '#333333',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
