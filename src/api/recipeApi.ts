import axios from "axios";

const SPOONACULAR_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key
const BASE_URL = "https://api.spoonacular.com";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
}

export const fetchRecipesByIngredients = async (
  ingredients: string[],
): Promise<Recipe[]> => {
  try {
    const ingredientsString = ingredients.join(",");
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients: ingredientsString,
        number: 10, // Number of recipes to fetch
        ranking: 1, // Maximize used ingredients
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
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
