/**
 * Image Helper Utility for Automatic Food Images
 * Uses Spoonacular CDN for consistent, high-quality food images
 */

export const getCleanFoodImage = (foodName: string): string => {
  // 1. Clean the string (lowercase and replace spaces with hyphens)
  const formattedName = foodName.trim().toLowerCase().replace(/\s+/g, '-');
  
  // 2. Return the Spoonacular CDN link
  // 250x250 is a perfect size for fridge item cards
  const spoonacularCdnUrl = process.env.EXPO_PUBLIC_SPOONACULAR_CDN_URL || "https://spoonacular.com/cdn/ingredients_250x250";
  const imageUrl = `${spoonacularCdnUrl}/${formattedName}.jpg`;
  return imageUrl;
};

/**
 * Fallback image for items that might not exist in Spoonacular database
 * or for any loading errors
 */
const spoonacularCdnUrl = process.env.EXPO_PUBLIC_SPOONACULAR_CDN_URL || "https://spoonacular.com/cdn/ingredients_250x250";
export const FALLBACK_IMAGE = `${spoonacularCdnUrl}/unknown.jpg`;

/**
 * Enhanced image function with fallback support
 */
export const getFoodImageWithFallback = (foodName: string): string => {
  try {
    return getCleanFoodImage(foodName);
  } catch (error) {
    console.warn(`Failed to generate image URL for ${foodName}, using fallback`);
    return FALLBACK_IMAGE;
  }
};

/**
 * Common South African food items that might need special handling
 * You can extend this mapping as needed
 */
export const SOUTH_AFRICAN_FOOD_MAPPING: Record<string, string> = {
  'biltong': 'beef-jerky',
  'boerewors': 'sausage',
  'pap': 'corn-porridge',
  'samoosa': 'samosa',
  'koeksisters': 'doughnut',
  'milktart': 'custard',
  'rooibos': 'tea',
  'droewors': 'beef-jerky',
};
