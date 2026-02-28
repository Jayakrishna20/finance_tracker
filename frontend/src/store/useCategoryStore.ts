import { create } from "zustand";
import { CategoriesAPI } from "../api/categories";
import type { Category, CreateCategoryPayload } from "../types";

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: Error | null;
    fetchCategories: () => Promise<void>;
    addCategory: (payload: CreateCategoryPayload) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
    updateCategory: (id: string, payload: Partial<CreateCategoryPayload>) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,
    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const categories = await CategoriesAPI.getAll();
            set({ categories, isLoading: false, error: null });
        } catch (error) {
            console.error("Failed to fetch categories", error);
            set({ error: error as Error, isLoading: false });
        }
    },
    addCategory: async (payload) => {
        try {
            await CategoriesAPI.create(payload);
            await get().fetchCategories();
        } catch (error) {
            console.error("Failed to add category", error);
            throw error;
        }
    },
    removeCategory: async (id) => {
        try {
            await CategoriesAPI.delete(id);
            await get().fetchCategories();
        } catch (error) {
            console.error("Failed to delete category", error);
            throw error;
        }
    },
    updateCategory: async (id, payload) => {
        try {
            await CategoriesAPI.update(id, payload as any);
            await get().fetchCategories();
        } catch (error) {
            console.error("Failed to update category", error);
            throw error;
        }
    },
}));
