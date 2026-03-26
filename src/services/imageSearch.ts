/**
 * Google Custom Search Engine Service for Niche Food Images
 * Finds high-quality, isolated product shots for any food item
 */

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const CX = process.env.EXPO_PUBLIC_GOOGLE_CX;

/**
 * Fallback image for items that might not exist in Google database
 */
export const FALLBACK_IMAGE = 'https://madeinindiarestaurant.com/img/placeholders/comfort_food_placeholder.png?v=1';

export const findNicheFoodImage = async (itemName: string) => {
  if (!GOOGLE_API_KEY || !CX) {
    console.warn('Google API credentials not found, using fallback image');
    return FALLBACK_IMAGE;
  }

  // We append keywords to "force" high-quality, isolated product shots
  const refinedQuery = `${itemName} food product isolated white background png`;
  
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(refinedQuery)}&searchType=image&key=${GOOGLE_API_KEY}&cx=${CX}&num=1&imgSize=medium&imgType=stock`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      console.log('Found niche image for', itemName, ':', data.items[0].link);
      return data.items[0].link; // The direct URL to the top image
    }
    console.log('No images found for', itemName);
    return FALLBACK_IMAGE; 
  } catch (error) {
    console.error("Image Search Failed:", error);
    return FALLBACK_IMAGE;
  }
};

/**
 * Primary image finder - uses Google Custom Search with fallback
 */
export const getBestFoodImage = async (itemName: string): Promise<string> => {
  console.log('Getting image for:', itemName);
  try {
    // Check if API keys are available
    if (!GOOGLE_API_KEY || !CX) {
      console.warn('Google API credentials not found, using fallback image');
      console.log('GOOGLE_API_KEY:', GOOGLE_API_KEY ? 'SET' : 'NOT SET');
      console.log('CX:', CX ? 'SET' : 'NOT SET');
      return FALLBACK_IMAGE;
    }
    
    // Try Google Custom Search for all items
    const nicheImage = await findNicheFoodImage(itemName);
    console.log('Final image URL for', itemName, ':', nicheImage);
    return nicheImage;
  } catch (error) {
    console.error('Google image search failed for', itemName, error);
    return FALLBACK_IMAGE;
  }
};
