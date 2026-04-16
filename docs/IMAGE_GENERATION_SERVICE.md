# Image Generation Service Documentation

## Overview

The Image Generation Service uses the NVIDIA Flux.2-Klein API to generate high-quality, studio-style images for food items in the InMyFridge app. This service provides a consistent visual experience with AI-generated images that match the app's cyber-neon theme.

## Features

- **Studio-Quality Images**: Professional photography-style prompts with charcoal black backgrounds
- **Intelligent Caching**: 30-day cache to save API costs and improve performance
- **Fallback System**: Automatic fallback to styled avatars if API fails
- **Theme Integration**: Images match the app's neon-cyber aesthetic
- **Error Handling**: Graceful handling of rate limits and API errors

## API Configuration

### Environment Setup

1. **Add to `.env` file:**
   ```env
   NVIDIA_FLUX_API_KEY=nvapi-YOUR_API_KEY_HERE
   ```

2. **The service reads directly from `process.env.NVIDIA_FLUX_API_KEY`**
   - No additional configuration needed in `app.json`
   - Environment variables are automatically available in Expo

### API Parameters

- **Model**: `flux.2-klein-4b`
- **Resolution**: `1024x1024`
- **Steps**: `4` (optimized for speed)
- **Seed**: `0` (consistent results)
- **Prompt Template**: `"Professional studio photography of [ItemName], centered, isolated on a deep charcoal black background, soft cinematic lighting, high-detail texture, 8k resolution, modern tech-forward aesthetic."`

## Usage Examples

### Basic Usage

```typescript
import { generateFridgeAsset } from '../services/imageGenerator';

// Generate image for a food item
const result = await generateFridgeAsset('Apple');

if (result.error) {
  console.warn('Using fallback:', result.error);
}

console.log('Image URL:', result.imageUrl);
console.log('From cache:', result.isFromCache);
```

### Integration with Add Item Workflow

```typescript
import { useFridgeStore } from '../context/fridgeStore';
import { generateFridgeAsset } from '../services/imageGenerator';

const addItem = useFridgeStore((state) => state.addItem);

const handleAddItem = async (itemName: string, quantity: number) => {
  try {
    // Generate AI image
    const imageResult = await generateFridgeAsset(itemName);
    
    // Add to store with image
    addItem({
      name: itemName,
      quantity,
      image: imageResult.imageUrl,
      category: categorizeItem(itemName),
    });
    
    console.log(`Added ${itemName} with ${imageResult.isFromCache ? 'cached' : 'new'} image`);
    
  } catch (error) {
    console.error('Failed to add item:', error);
  }
};
```

## Cache Management

### Cache Keys
- Format: `fridge_image_[itemname_lowercase]`
- Duration: 30 days
- Storage: AsyncStorage

### Cache Operations

```typescript
import { clearImageCache, getCacheStats } from '../services/imageGenerator';

// Clear all cached images
await clearImageCache();

// Get cache statistics
const stats = await getCacheStats();
console.log(`Cached images: ${stats.totalImages}`);
```

## Error Handling

### Error Types

1. **API Key Missing**: Service not configured
2. **Rate Limit (429)**: Too many requests
3. **Server Error (500)**: API unavailable
4. **No Images Returned**: Empty response

### Fallback Strategy

When API fails, the service automatically falls back to:
- **Mapped Icons**: Predefined icons for common items (apple, milk, etc.)
- **Letter Avatars**: Styled avatars with item initials
- **Theme Colors**: Charcoal background with neon green accents

## Performance Optimization

### Caching Benefits

- **Cost Savings**: No duplicate API calls for same items
- **Speed**: Cached images load instantly
- **Reliability**: Works even when API is down

### Best Practices

1. **Call Early**: Generate images when user selects item, not at final confirmation
2. **Show Loading**: Display loading indicator during generation
3. **Handle Errors Gracefully**: Always have fallback UI
4. **Batch Operations**: Use cache for multiple similar items

## Theme Integration

### Visual Consistency

All generated images follow the same prompt structure:
- **Background**: Deep charcoal black (`#1a1a1a`)
- **Lighting**: Soft cinematic
- **Style**: Professional studio photography
- **Resolution**: 8k quality
- **Aesthetic**: Modern tech-forward

### Fallback Styling

Fallback avatars use:
- **Background**: `#1a1a1a` (matches theme)
- **Text Color**: `#8EFF71` (neon green)
- **Size**: 256x256
- **Style**: Bold, modern

## Security Considerations

### API Key Protection

1. **Environment Variables**: Store in `.env` file ONLY
2. **Direct Access**: Service reads from `process.env.NVIDIA_FLUX_API_KEY`
3. **Client-Side Only**: Key is visible in app bundle
4. **Rotation**: Regularly rotate API keys
5. **NEVER Hardcode**: Never commit actual API keys to version control

### Recommendations

```bash
# Never commit API keys to git
echo ".env" >> .gitignore

# Use different keys for development/production
NVIDIA_FLUX_API_KEY_DEV=...
NVIDIA_FLUX_API_KEY_PROD=...
```

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Check `.env` file exists
   - Verify `app.json` extra section
   - Restart Expo development server

2. **"Rate limit exceeded"**
   - Wait before retrying
   - Implement exponential backoff
   - Consider cache warming

3. **"No images returned"**
   - Check API key validity
   - Verify prompt format
   - Check NVIDIA service status

### Debug Mode

```typescript
// Enable debug logging
console.log('API Key configured:', !!Constants.expoConfig?.extra?.nvidiaApiKey);
console.log('Cache stats:', await getCacheStats());
```

## API Limits and Costs

### NVIDIA Flux.2-Klein

- **Cost**: ~$0.004 per image
- **Rate Limits**: Varies by plan
- **Resolution**: 1024x1024 optimal
- **Speed**: ~2-4 seconds with 4 steps

### Cost Optimization

- **Caching**: 90%+ cost reduction with cache
- **Batch Processing**: Generate multiple items in sequence
- **Smart Preloading**: Cache common items proactively

## Future Enhancements

### Planned Features

1. **Custom Prompts**: User-defined image styles
2. **Image Variations**: Multiple images per item
3. **Background Removal**: Transparent PNG support
4. **Image Editing**: In-app image adjustments
5. **Offline Support**: Local image generation

### Extension Points

```typescript
// Custom prompt template
const customPrompt = `Minimalist flat lay of ${itemName} on marble surface, natural lighting, food photography style`;

// Alternative image sources
const alternativeSources = [
  generateFridgeAsset,
  generateFromUnsplash,
  generateFromStableDiffusion,
];
```

## Integration Checklist

- [ ] Add NVIDIA API key to `.env`
- [ ] Import `generateFridgeAsset` service
- [ ] Implement loading states
- [ ] Add error handling
- [ ] Test with various food items
- [ ] Verify cache functionality
- [ ] Check fallback behavior
- [ ] Monitor API usage and costs

## Support

For issues related to:
- **API Keys**: Contact NVIDIA API support
- **Service Integration**: Check service documentation
- **Theme Integration**: Review theme configuration
- **Performance**: Monitor cache hit rates

---

*This service transforms the InMyFridge app with professional, AI-generated images that enhance the user experience while maintaining cost efficiency and reliability.*
