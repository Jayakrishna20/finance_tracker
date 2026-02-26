import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, CreateCategoryPayload } from "../types";

interface CategoryState {
    categories: Category[];
    addCategory: (payload: CreateCategoryPayload) => void;
    removeCategory: (id: string) => void;
    updateCategory: (id: string, payload: Partial<CreateCategoryPayload>) => void;
}

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set) => ({
            categories: [], // Removed dummy data
            addCategory: (payload) =>
                set((state) => ({
                    categories: [
                        ...state.categories,
                        { ...payload, id: crypto.randomUUID() },
                    ],
                })),
            removeCategory: (id) =>
                set((state) => ({
                    categories: state.categories.filter((c) => c.id !== id),
                })),
            updateCategory: (id, payload) =>
                set((state) => ({
                    categories: state.categories.map((c) =>
                        c.id === id ? { ...c, ...payload } : c
                    ),
                })),
        }),
        {
            name: "category-storage",
        }
    )
);
