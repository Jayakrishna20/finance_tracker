import { create } from "zustand";
import { CategoriesAPI } from "../api/categories";
import type { Category, CreateCategoryPayload } from "../types";

interface CategoryState {
    categories: Category[];
    categoryTypes: { categoryTypeId: number, categoryTypeName: string }[];
    isLoading: boolean;
    error: Error | null;
    fetchCategories: (force?: boolean) => Promise<void>;
    fetchCategoryTypes: () => Promise<void>;
    addCategory: (payload: CreateCategoryPayload) => Promise<void>;
    removeCategory: (id: number) => Promise<void>;
    updateCategory: (id: number, payload: Partial<CreateCategoryPayload>) => Promise<void>;
}

import { CategoryTypesAPI } from "../api/categoryTypes";

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    categoryTypes: [],
    isLoading: false,
    error: null,
    fetchCategoryTypes: async (force = false) => {
        if (!force && get().categoryTypes.length > 0) return;
        try {
            const types = await CategoryTypesAPI.getAll();
            set({ categoryTypes: types });
        } catch (error) {
            console.error("Failed to fetch category types", error);
        }
    },
    fetchCategories: async (force = false) => {
        if (!force && (get().isLoading || get().categories.length > 0)) return;
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
            await get().fetchCategories(true);
        } catch (error) {
            console.error("Failed to add category", error);
            throw error;
        }
    },
    removeCategory: async (id) => {
        try {
            await CategoriesAPI.delete(id);
            await get().fetchCategories(true);
        } catch (error) {
            console.error("Failed to delete category", error);
            throw error;
        }
    },
    updateCategory: async (id, payload) => {
        try {
            await CategoriesAPI.update(id, payload as any);
            await get().fetchCategories(true);
        } catch (error) {
            console.error("Failed to update category", error);
            throw error;
        }
    },
}));
