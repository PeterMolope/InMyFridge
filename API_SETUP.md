# Spoonacular API Setup

## Getting Your API Key

1. Go to [Spoonacular Console](https://spoonacular.com/food-api/console)
2. Sign up for a free account
3. Navigate to your API dashboard
4. Copy your API key

## Setting Up the API Key

### Option 1: Environment Variable (Recommended)

1. Open the `.env` file in your project root
2. Replace the placeholder with your actual API key:

```env
EXPO_PUBLIC_SPOONACULAR_API_KEY=your-actual-api-key-here
```

3. Restart your development server for the changes to take effect

### Option 2: For Production

For production apps, consider using:
- Expo's built-in environment variables
- Secure key management services
- Backend proxy to hide the API key

## API Usage

The app uses the Spoonacular Food Ingredients Autocomplete API:
- **Endpoint**: `https://api.spoonacular.com/food/ingredients/autocomplete`
- **Rate Limit**: Free tier allows 150 requests/day
- **Debouncing**: 300ms delay to prevent API spam

## Features

- **Real-time Search**: Ingredient suggestions as you type
- **Debounced Requests**: Prevents excessive API calls
- **Error Handling**: Graceful fallbacks for API errors
- **Loading States**: Visual feedback during API calls

## Security Notes

- Never commit your actual API key to version control
- Add `.env` to your `.gitignore` file
- Consider rotating API keys regularly
- Monitor your API usage in the Spoonacular dashboard
