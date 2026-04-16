import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const NVIDIA_API_URL = 'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b';
const CACHE_PREFIX = 'fridge_image_';
const CACHE_EXPIRY_DAYS = 30; // Cache images for 30 days

export interface ImageGenerationResult {
  imageUrl: string;
  isFromCache: boolean;
  error?: string;
}

/**
 * Generates a high-quality studio-style image for a food item using NVIDIA Flux.2-Klein API
 * @param itemName The name of the food item to generate an image for
 * @returns Promise with image URL and cache status
 */
export const generateFridgeAsset = async (itemName: string): Promise<ImageGenerationResult> => {
  console.log(`=== generateFridgeAsset called for: "${itemName}" ===`);
  
  try {
    // Skip cache for problematic items to force fresh generation
    const lowerItemName = itemName.toLowerCase();
    const problemItems = ['apple', 'milk', 'orange', 'banana', 'grape'];
    
    let cachedImage = null;
    if (!problemItems.includes(lowerItemName)) {
      console.log('Checking cache...');
      cachedImage = await getCachedImage(itemName);
      if (cachedImage) {
        console.log(`Found cached image for "${itemName}": ${cachedImage}`);
        return {
          imageUrl: cachedImage,
          isFromCache: true,
        };
      }
    } else {
      console.log(`Skipping cache for problematic item: "${itemName}"`);
      // Clear any existing cache for this item
      const cacheKey = `${CACHE_PREFIX}${itemName.toLowerCase()}`;
      try {
        await AsyncStorage.removeItem(cacheKey);
        console.log(`Cleared cache for "${itemName}"`);
      } catch (error) {
        console.log('Failed to clear cache:', error);
      }
    }
    
    console.log('Generating new image...');

    // Generate new image
    const imageUrl = await generateImage(itemName);
    
    // Cache the result
    await cacheImage(itemName, imageUrl);
    
    return {
      imageUrl,
      isFromCache: false,
    };
  } catch (error) {
    console.error('Image generation failed:', error);
    
    // Return fallback icon URL
    const fallbackUrl = getFallbackIcon(itemName);
    console.log(`Using fallback for "${itemName}": ${fallbackUrl}`);
    return {
      imageUrl: fallbackUrl,
      isFromCache: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generates a new image using the NVIDIA API
 */
const generateImage = async (itemName: string): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
  
  if (!apiKey) {
    throw new Error('NVIDIA API key not configured. Please set EXPO_PUBLIC_NVIDIA_FLUX_API_KEY in your .env file and restart the development server.');
  }

  // Handle problematic words that might trigger logo fallbacks
  let foodDescription = itemName;
  const problematicWords: Record<string, string> = {
    'apple': 'red apple fruit',
    'milk': 'carton of milk beverage',
    'orange': 'orange citrus fruit',
    'banana': 'yellow banana fruit',
    'grape': 'purple grapes fruit',
    'cheese': 'cheese dairy product',
    'bread': 'loaf of bread bakery item',
    'egg': 'fresh eggs poultry product',
    'tomato': 'red tomato vegetable',
    'potato': 'potato vegetable',
    'carrot': 'orange carrot vegetable',
    'lettuce': 'fresh lettuce leafy green',
    'chicken': 'raw chicken meat protein',
    'beef': 'raw beef meat protein',
    'fish': 'fresh fish seafood',
    'rice': 'cooked rice grain food',
    'pasta': 'cooked pasta Italian food',
  };

  const lowerItemName = itemName.toLowerCase();
  if (problematicWords[lowerItemName]) {
    foodDescription = problematicWords[lowerItemName];
    console.log(`Mapped "${itemName}" to "${foodDescription}" to avoid logo fallback`);
  }

  // Food-specific studio photography prompt with enhanced specificity
  const prompt = `Professional food photography of a fresh ${foodDescription} as a grocery item, centered, isolated on a deep charcoal black background, soft cinematic lighting, high-detail texture, 8k resolution, modern tech-forward aesthetic. Real edible food product, fresh produce, not a company logo, not a brand symbol, actual food item for consumption.`;

  const payload = {
    prompt,
    width: 1024,
    height: 1024,
    seed: 0,
    steps: 4, // Optimized for speed
  };

  console.log('Making API request to:', NVIDIA_API_URL);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (response.status >= 500) {
      throw new Error('API server error. Using fallback icon.');
    } else {
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
  }

  // Get response as text first to ensure proper parsing
  const responseText = await response.text();
  console.log('Raw response length:', responseText.length);
  console.log('Response starts with:', responseText.substring(0, 100));
  
  // Parse JSON manually
  let result;
  try {
    result = JSON.parse(responseText);
    console.log('JSON parsing successful');
    console.log('API Response keys:', Object.keys(result));
  } catch (parseError) {
    console.error('JSON parsing failed:', parseError);
    console.error('Response text:', responseText.substring(0, 500));
    throw new Error('Failed to parse API response as JSON');
  }
  
  console.log('Result type:', typeof result);
  console.log('Has artifacts:', 'artifacts' in result);
  console.log('Artifacts type:', typeof result.artifacts);
  console.log('Artifacts is array:', Array.isArray(result.artifacts));
  console.log('Artifacts length:', result.artifacts?.length);
  
  // NVIDIA API returns artifacts array with base64 image data
  if (result.artifacts && Array.isArray(result.artifacts) && result.artifacts.length > 0) {
    console.log('Processing artifacts array...');
    const firstArtifact = result.artifacts[0];
    console.log('First artifact keys:', Object.keys(firstArtifact));
    console.log('Has base64:', 'base64' in firstArtifact);
    console.log('Base64 type:', typeof firstArtifact.base64);
    console.log('Base64 length:', firstArtifact.base64?.length);
    
    if (firstArtifact.base64) {
      console.log('Found base64 image data in artifacts[0].base64, length:', firstArtifact.base64.length);
      return `data:image/png;base64,${firstArtifact.base64}`;
    } else {
      console.log('Artifact found but no base64 field:', firstArtifact);
      throw new Error('API returned artifacts but no base64 image data');
    }
  } else {
    console.log('Artifacts condition failed - details:');
    console.log('- result.artifacts exists:', !!result.artifacts);
    console.log('- is array:', Array.isArray(result.artifacts));
    console.log('- length > 0:', result.artifacts?.length > 0);
  }
  
  // Fallback for other response structures
  const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && value.length > 1000 && base64Pattern.test(value.substring(0, 100))) {
      console.log(`Found base64 data in field: ${key}, length: ${value.length}`);
      return `data:image/png;base64,${value}`;
    }
  }
  
  // Check for other common response structures
  if (result.images && result.images.length > 0) {
    return result.images[0].url;
  } else if (result.data && result.data.length > 0) {
    return result.data[0].url;
  } else if (result.url) {
    return result.url;
  } else {
    console.error('Unexpected API response structure:', result);
    throw new Error('No images returned from API - unexpected response structure');
  }
}

/**
 * Caches an image URL for a given item name
 */
const cacheImage = async (itemName: string, imageUrl: string): Promise<void> => {
  try {
    const cacheKey = `${CACHE_PREFIX}${itemName.toLowerCase()}`;
    const cacheData = {
      url: imageUrl,
      timestamp: Date.now(),
    };
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to cache image:', error);
    // Don't throw error - caching failure shouldn't break the app
  }
}

/**
 * Retrieves a cached image URL for a given item name
 */
const getCachedImage = async (itemName: string): Promise<string | null> => {
  try {
    const cacheKey = `${CACHE_PREFIX}${itemName.toLowerCase()}`;
    const cachedData = await AsyncStorage.getItem(cacheKey);
    
    if (!cachedData) {
      return null;
    }

    const { url, timestamp } = JSON.parse(cachedData);
    
    // Check if cache has expired
    const cacheAge = Date.now() - timestamp;
    const maxAge = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    if (cacheAge > maxAge) {
      // Remove expired cache
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return url;
  } catch (error) {
    console.error('Failed to retrieve cached image:', error);
    return null;
  }
}

/**
 * Returns a fallback icon URL based on item category
 */
function getFallbackIcon(itemName: string): string {
  // Map common food items to Lucide icon names
  const iconMap: Record<string, string> = {
    apple: 'apple',
    banana: 'banana',
    orange: 'circle', // No orange icon in Lucide
    milk: 'milk',
    cheese: 'cheese',
    bread: 'wheat',
    egg: 'egg',
    tomato: 'tomato',
    potato: 'circle', // No potato icon
    carrot: 'carrot',
    lettuce: 'leaf',
    chicken: 'drumstick',
    beef: 'circle', // No beef icon
    fish: 'fish',
    rice: 'circle', // No rice icon
    pasta: 'circle', // No pasta icon
  };

  const normalizedItem = itemName.toLowerCase();
  
  // Return matching icon if available
  if (iconMap[normalizedItem]) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(iconMap[normalizedItem])}&background=1a1a1a&color=8EFF71&size=256&bold=true`;
  }

  // Default fallback with item name
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(itemName.charAt(0).toUpperCase())}&background=1a1a1a&color=8EFF71&size=256&bold=true`;
}

/**
 * Clears all cached images (useful for testing or storage cleanup)
 */
export const clearImageCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const imageKeys = keys.filter((key: string) => key.startsWith(CACHE_PREFIX));
    
    if (imageKeys.length > 0) {
      await AsyncStorage.multiRemove(imageKeys);
    }
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
}

/**
 * Gets cache statistics for debugging
 */
export const getCacheStats = async (): Promise<{ totalImages: number; totalSize: string }> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const imageKeys = keys.filter((key: string) => key.startsWith(CACHE_PREFIX));
    
    return {
      totalImages: imageKeys.length,
      totalSize: 'N/A', // AsyncStorage doesn't provide size info
    };
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return { totalImages: 0, totalSize: 'N/A' };
  }
}
