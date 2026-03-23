import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI - You'll need to set your API key
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface FoodIdentificationResult {
  itemName: string;
  confidence?: number;
}

/**
 * Identifies food item from an image using Google Gemini AI
 * @param imageUri - URI of the captured image
 * @param base64 - Optional base64 string of the image
 * @returns Promise with identified food item name
 */
export async function identifyFoodFromImage(
  imageUri: string, 
  base64?: string
): Promise<FoodIdentificationResult> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Get the Gemini Vision model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let imageData: string;
    
    if (base64) {
      // Use base64 data if provided
      imageData = base64;
    } else {
      // Otherwise, you would need to convert the URI to base64
      // For now, we'll assume base64 is provided
      throw new Error('Base64 image data is required');
    }

    // Prepare the image for Gemini
    const image = {
      inlineData: {
        data: imageData,
        mimeType: 'image/jpeg',
      },
    };

    // Prompt for food identification
    const prompt = `Identify the food item in this image. Return only the name of the food item. Be specific but concise. For example:
- If it's a banana, return "banana"
- If it's carton of milk, return "milk"
- If it's tomatoes, return "tomatoes"
- If it's chicken breast, return "chicken breast"
Do not include any additional text, explanations, or punctuation.`;

    // Generate content
    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('No food item identified');
    }

    // Clean up the response
    const itemName = text.trim().toLowerCase();
    
    return {
      itemName,
      confidence: 0.85 // Default confidence since Gemini doesn't provide it directly
    };

  } catch (error) {
    console.error('Error identifying food from image:', error);
    throw new Error(`Failed to identify food: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Alternative function that uses expo-image-picker's base64 output
 */
export async function identifyFoodFromBase64(base64Data: string): Promise<FoodIdentificationResult> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const image = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };

    const prompt = `Identify the food item in this image. Return only the name of the food item. Be specific but concise. For example:
- If it's a banana, return "banana"
- If it's carton of milk, return "milk"
- If it's tomatoes, return "tomatoes"
- If it's chicken breast, return "chicken breast"
Do not include any additional text, explanations, or punctuation.`;

    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error('No food item identified');
    }

    return {
      itemName: text.trim().toLowerCase(),
      confidence: 0.85
    };

  } catch (error) {
    console.error('Error identifying food from base64:', error);
    throw new Error(`Failed to identify food: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
