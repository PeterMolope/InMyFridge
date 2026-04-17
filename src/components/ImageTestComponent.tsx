import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export function ImageTestComponent() {
  const [testResult, setTestResult] = useState<string>('Not tested yet');

  const testEnvironment = () => {
    console.log('=== Testing Environment Variables ===');
    
    // Test different ways to access the API key
    const apiKey1 = process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
    const apiKey2 = Constants.expoConfig?.extra?.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
    const apiKey3 = Constants.manifest?.extra?.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
    
    const result = `
API Key Tests:
- process.env: ${apiKey1 ? 'FOUND' : 'NOT FOUND'} (${apiKey1?.length || 0} chars)
- Constants.expoConfig.extra: ${apiKey2 ? 'FOUND' : 'NOT FOUND'} (${apiKey2?.length || 0} chars)
- Constants.manifest.extra: ${apiKey3 ? 'FOUND' : 'NOT FOUND'} (${apiKey3?.length || 0} chars)

All env vars: ${Object.keys(process.env).filter(k => k.includes('NVIDIA')).join(', ')}

Expo Config keys: ${Constants.expoConfig?.extra ? Object.keys(Constants.expoConfig.extra).filter(k => k.includes('NVIDIA')).join(', ') : 'NONE'}
    `;
    
    console.log(result);
    setTestResult(result);
    
    Alert.alert('Environment Test', result);
  };

  const testAPI = async () => {
    console.log('=== Testing API Call ===');
    
    const apiKey = process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
    
    if (!apiKey) {
      const error = 'No API key found in process.env';
      console.error(error);
      setTestResult(error);
      Alert.alert('API Test Failed', error);
      return;
    }
    
    console.log('Using API key:', apiKey.substring(0, 10) + '...');
    
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_URL || 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Professional food photography of a fresh red apple fruit',
          width: 1024,
          height: 1024,
          seed: 0,
          steps: 4,
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        const error = `API Error: ${response.status} - ${errorText}`;
        console.error(error);
        setTestResult(error);
        Alert.alert('API Test Failed', error);
        return;
      }

      const result = await response.json();
      console.log('Success! Response keys:', Object.keys(result));
      
      if (result.artifacts && result.artifacts.length > 0) {
        const artifact = result.artifacts[0];
        if (artifact.base64) {
          const success = `SUCCESS: Image generated! Base64 length: ${artifact.base64.length}`;
          console.log(success);
          setTestResult(success);
          Alert.alert('API Test Success', success);
          return;
        }
      }
      
      const error = 'No image data in response';
      console.error(error);
      setTestResult(error);
      Alert.alert('API Test Failed', error);
      
    } catch (error) {
      const errorMsg = `Network error: ${error.message}`;
      console.error(errorMsg);
      setTestResult(errorMsg);
      Alert.alert('API Test Failed', errorMsg);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#1a1a1a', margin: 10, borderRadius: 10 }}>
      <Text style={{ color: '#8EFF71', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Image Generation Debug
      </Text>
      
      <TouchableOpacity
        onPress={testEnvironment}
        style={{ backgroundColor: '#333', padding: 10, borderRadius: 5, marginBottom: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Test Environment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={testAPI}
        style={{ backgroundColor: '#333', padding: 10, borderRadius: 5, marginBottom: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Test API Call</Text>
      </TouchableOpacity>
      
      <Text style={{ color: '#8EFF71', fontSize: 12, marginTop: 10 }}>
        Last Result:
      </Text>
      <Text style={{ color: '#fff', fontSize: 10, marginTop: 5 }}>
        {testResult}
      </Text>
    </View>
  );
}
