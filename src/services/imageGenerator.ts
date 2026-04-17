import AsyncStorage from '@react-native-async-storage/async-storage';

const NVIDIA_API_URL = process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_URL || "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b";
const CACHE_PREFIX = "fridge_image_";
const CACHE_EXPIRY_DAYS = 30;

interface ImageGenerationResult {
  imageUrl: string;
  isFromCache: boolean;
  error?: string;
}

/**
 * Problematic word mapping to avoid logo generation
 */
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

/**
 * Get cached image for a food item
 */
const getCachedImage = async (itemName: string): Promise<string | null> => {
  try {
    const cacheKey = `${CACHE_PREFIX}${itemName.toLowerCase()}`;
    const cachedData = await AsyncStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { url, timestamp } = JSON.parse(cachedData);
      const ageInDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
      
      if (ageInDays < CACHE_EXPIRY_DAYS) {
        return url;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
};

/**
 * Cache an image URL for a food item
 */
const cacheImage = async (itemName: string, imageUrl: string): Promise<void> => {
  try {
    const cacheKey = `${CACHE_PREFIX}${itemName.toLowerCase()}`;
    const cacheData = {
      url: imageUrl,
      timestamp: Date.now()
    };
    
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching image:', error);
  }
};

/**
 * Get fallback icon URL for a food item
 */
const getFallbackIcon = (itemName: string): string => {
  // Use Lucide icons as fallback
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(itemName)}&background=random`;
};

/**
 * Generate new image using NVIDIA API
 */
const generateImage = async (itemName: string): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_NVIDIA_FLUX_API_KEY;
  
  if (!apiKey) {
    throw new Error('NVIDIA API key not configured. Please set EXPO_PUBLIC_NVIDIA_FLUX_API_KEY in your .env file and restart the development server.');
  }

  // Handle problematic words that might trigger logo fallbacks
  let foodDescription = itemName;
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

  console.log('API Request:', { url: NVIDIA_API_URL, payload });

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
  
  // Parse JSON manually
  let result;
  try {
    result = JSON.parse(responseText);
    console.log('API Response:', { status: response.status, keys: Object.keys(result) });
  } catch (parseError) {
    console.error('JSON parsing failed:', parseError);
    throw new Error('Failed to parse API response as JSON');
  }
  
  // NVIDIA API returns artifacts array with base64 image data
  if (result.artifacts && Array.isArray(result.artifacts) && result.artifacts.length > 0) {
    const firstArtifact = result.artifacts[0];
    
    if (firstArtifact.base64) {
      console.log('Image Generated:', { 
        item: itemName,
        type: 'base64',
        size: firstArtifact.base64.length 
      });
      return `data:image/png;base64,${firstArtifact.base64}`;
    } else {
      console.error('No base64 data in artifact');
      throw new Error('API returned artifacts but no base64 image data');
    }
  }
  
  // Fallback for other response structures
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
};

/**
 * Main export function - generates high-quality studio-style image for food items
 */
export const generateFridgeAsset = async (itemName: string): Promise<ImageGenerationResult> => {
  console.log('Image Generation Request:', { item: itemName });
  
  try {
    // Skip cache for problematic items to force fresh generation
    const lowerItemName = itemName.toLowerCase();
    const problemItems = ['apple', 'milk', 'orange', 'banana', 'grape'];
    
    let cachedImage = null;
    if (!problemItems.includes(lowerItemName)) {
      cachedImage = await getCachedImage(itemName);
      if (cachedImage) {
        console.log('Cache Hit:', { item: itemName, fromCache: true });
        return {
          imageUrl: cachedImage,
          isFromCache: true,
        };
      }
    } else {
      // Clear any existing cache for this item
      const cacheKey = `${CACHE_PREFIX}${itemName.toLowerCase()}`;
      try {
        await AsyncStorage.removeItem(cacheKey);
        console.log('Cache Cleared:', { item: itemName, reason: 'problematic_item' });
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }

    // Generate new image
    const imageUrl = await generateImage(itemName);
    
    // Cache the result
    await cacheImage(itemName, imageUrl);
    
    return {
      imageUrl,
      isFromCache: false,
    };
  } catch (error) {
    console.error('Image Generation Failed:', { 
      item: itemName, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    // Return fallback icon URL
    const fallbackUrl = getFallbackIcon(itemName);
    return {
      imageUrl: fallbackUrl,
      isFromCache: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Clear all cached images
 */
export const clearImageCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const imageKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(imageKeys);
    console.log(`Cleared ${imageKeys.length} cached images`);
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (): Promise<{ totalImages: number; totalSize: string }> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const imageKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    let totalSize = 0;
    for (const key of imageKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        totalSize += data.length;
      }
    }
    
    return {
      totalImages: imageKeys.length,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { totalImages: 0, totalSize: '0 KB' };
  }
};
