import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getBestFoodImage } from "../services/imageSearch";

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
        
        // 1. Fetch the image FIRST before adding to state
        const tempImage = await getBestFoodImage(item.name);
        console.log('Final image in store:', tempImage);
        
        // 2. ONLY THEN add it to the state with the real URL
        set((state) => ({
          items: [...state.items, { 
            ...item, 
            id: Date.now().toString(),
            image: tempImage
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
          console.log('Fetching image for existing item:', item.name);
          const freshImage = await getBestFoodImage(item.name);
          
          set((state) => ({
            items: state.items.map(existingItem =>
              existingItem.id === item.id 
                ? { ...existingItem, image: freshImage }
                : existingItem
            ),
          }));
          
          console.log('Updated image for', item.name, ':', freshImage);
        }
      },
    }),
    {
      name: "fridge-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
