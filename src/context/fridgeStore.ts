import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FoodItem {
  id: string;
  name: string;
  expirationDate?: Date;
  category?: string;
  quantity?: number;
}

interface FridgeState {
  items: FoodItem[];
  selectedItems: string[]; // ids of selected items
  addItem: (item: Omit<FoodItem, "id">) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<FoodItem>) => void;
  clearFridge: () => void;
  toggleSelectItem: (id: string) => void;
  clearSelection: () => void;
}

export const useFridgeStore = create<FridgeState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: Date.now().toString() }],
        })),
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
    }),
    {
      name: "fridge-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
