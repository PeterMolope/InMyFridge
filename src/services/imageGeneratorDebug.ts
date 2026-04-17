import Constants from 'expo-constants';

const NVIDIA_API_URL = process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_URL || "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b";

/**
 * Debug version of image generator to identify issues
 */
export const debugImageGeneration = async (itemName: string) => {
  console.log('=== DEBUG: Image Generation Started ===');
  console.log('Item name:', itemName);
  
  // Check different ways to access the API key
  console.log('Checking API key access methods:');
  
  // Method 1: process.env
  const apiKey1 = process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
  console.log('Method 1 - process.env:', apiKey1 ? 'FOUND' : 'NOT FOUND');
  console.log('Key length:', apiKey1?.length || 0);
  
  // Method 2: Constants.expoConfig?.extra
  const apiKey2 = Constants.expoConfig?.extra?.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
  console.log('Method 2 - Constants.expoConfig.extra:', apiKey2 ? 'FOUND' : 'NOT FOUND');
  console.log('Key length:', apiKey2?.length || 0);
  
  // Method 3: Constants.manifest?.extra
  const apiKey3 = Constants.manifest?.extra?.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
  console.log('Method 3 - Constants.manifest.extra:', apiKey3 ? 'FOUND' : 'NOT FOUND');
  console.log('Key length:', apiKey3?.length || 0);
  
  // Show all environment variables
  console.log('All process.env keys:', Object.keys(process.env).filter(k => k.includes('NVIDIA')));
  console.log('All Constants.expoConfig?.extra keys:', Constants.expoConfig?.extra ? Object.keys(Constants.expoConfig.extra).filter(k => k.includes('NVIDIA')) : 'NO EXPO CONFIG');
  
  const apiKey = apiKey1 || apiKey2 || apiKey3;
  
  if (!apiKey) {
    console.error('ERROR: No API key found in any method');
    return {
      success: false,
      error: 'API key not found in any environment variable access method'
    };
  }
  
  console.log('Using API key:', apiKey.substring(0, 10) + '...');
  
  const payload = {
    prompt: `Professional food photography of a fresh ${itemName} as a grocery item, centered, isolated on a deep charcoal black background, soft cinematic lighting, high-detail texture, 8k resolution, modern tech-forward aesthetic.`,
    width: 1024,
    height: 1024,
    seed: 0,
    steps: 4,
  };

  console.log('Making API request...');
  
  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorText}`
      };
    }

    const result = await response.json();
    console.log('Success! Response keys:', Object.keys(result));

    if (result.artifacts && result.artifacts.length > 0) {
      const artifact = result.artifacts[0];
      if (artifact.base64) {
        console.log('Image generated successfully!');
        console.log('Base64 length:', artifact.base64.length);
        return {
          success: true,
          imageUrl: `data:image/png;base64,${artifact.base64}`,
          message: 'Image generated successfully'
        };
      }
    }

    return {
      success: false,
      error: 'No image data in response'
    };

  } catch (error) {
    console.error('Network error:', error);
    return {
      success: false,
      error: `Network error: ${error.message}`
    };
  }
};
