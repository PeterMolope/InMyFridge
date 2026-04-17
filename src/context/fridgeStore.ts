import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateFridgeAsset } from "../services/imageGenerator";

export interface FoodItem {
  id: string;
  name: string;
  expirationDate?: Date;
  category?: string;
  quantity?: number;
  image?: string;
}

interface FridgeState {
  items: FoodItem[];
  selectedItems: string[]; // ids of selected items
  addItem: (item: Omit<FoodItem, "id">) => Promise<void>;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<FoodItem>) => void;
  clearFridge: () => void;
  toggleSelectItem: (id: string) => void;
  clearSelection: () => void;
  initializeItems: () => Promise<void>;
}

export const useFridgeStore = create<FridgeState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [],
      addItem: async (item) => {
        console.log('Store addItem called with:', item);
        
        // 1. Generate the image FIRST before adding to state
        const imageResult = await generateFridgeAsset(item.name);
                
        // 2. Check if image generation was successful
        if (imageResult.error) {
          console.error('Image generation failed:', imageResult.error);
          throw new Error(`Image generation failed: ${imageResult.error}`);
        }
        
        // 3. ONLY THEN add it to the state with the generated image URL
        set((state) => ({
          items: [...state.items, { 
            ...item, 
            id: Date.now().toString(),
            image: imageResult.imageUrl
          }],
        }));
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          selectedItems: state.selectedItems.filter((selId) => selId !== id),
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        })),
      clearFridge: () => set({ items: [], selectedItems: [] }),
      toggleSelectItem: (id) =>
        set((state) => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter((selId) => selId !== id)
            : [...state.selectedItems, id],
        })),
      clearSelection: () => set({ selectedItems: [] }),
      
      // Initialize existing items with proper images
      initializeItems: async () => {
        const state = get();
        console.log('Initializing images for', state.items.length, 'items');
        
        // Process items that don't have images
        const itemsToUpdate = state.items.filter(item => !item.image);
        console.log('Found', itemsToUpdate.length, 'items without images');
        
        if (itemsToUpdate.length === 0) {
          console.log('All items have images, skipping initialization');
          return;
        }
        
        // Update each item individually to avoid race conditions
        for (const item of itemsToUpdate) {
          console.log('Generating image for existing item:', item.name);
          const imageResult = await generateFridgeAsset(item.name);
          
          if (imageResult.error) {
            console.error('Failed to generate image for', item.name, ':', imageResult.error);
            // Continue with next item instead of failing completely
            continue;
          }
          
          set((state) => ({
            items: state.items.map(existingItem =>
              existingItem.id === item.id 
                ? { ...existingItem, image: imageResult.imageUrl }
                : existingItem
            ),
          }));
          
          console.log('Updated image for', item.name, ':', imageResult.imageUrl);
        }
      },
    }),
    {
      name: "fridge-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
