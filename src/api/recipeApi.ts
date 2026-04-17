import axios from "axios";

const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY || "";
const BASE_URL = process.env.EXPO_PUBLIC_SPOONACULAR_API_URL || "https://api.spoonacular.com";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: Array<{
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
  }>;
  usedIngredients: Array<{
    id: number;
    amount: number;
    unit: string;
    unitLong: string;
    unitShort: string;
    aisle: string;
    name: string;
    original: string;
    originalName: string;
    meta: string[];
  }>;
  likes: number;
}

export interface RecipeSearchParams {
  ingredients: string[];
  number?: number;
  ranking?: number;
  ignorePantry?: boolean;
}

export const fetchRecipesByIngredients = async (
  params: RecipeSearchParams,
): Promise<Recipe[]> => {
  if (!SPOONACULAR_API_KEY) {
    throw new Error("Spoonacular API key is required. Please set EXPO_PUBLIC_SPOONACULAR_API_KEY.");
  }

  const {
    ingredients,
    number = 10,
    ranking = 1,
    ignorePantry = false,
  } = params;

  if (!ingredients || ingredients.length === 0) {
    throw new Error("At least one ingredient is required");
  }

  try {
    const ingredientsString = ingredients.join(",");
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients: ingredientsString,
        number,
        ranking,
        ignorePantry,
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        throw new Error("API quota exceeded. Please check your Spoonacular API plan.");
      } else if (error.response?.status === 401) {
        throw new Error("Invalid API key. Please check your EXPO_PUBLIC_SPOONACULAR_API_KEY.");
      } else if (error.code === 'ECONNABORTED') {
        throw new Error("Request timeout. Please check your internet connection.");
      }
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

export const fetchRecipeDetails = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    return null;
  }
};
