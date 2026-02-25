import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CategoryItem {
    name: string;
    color: string;
    type: 'normal' | 'credit';
}

interface CategoryState {
    categories: CategoryItem[];
    addCategory: (category: string, color?: string, type?: 'normal' | 'credit') => void;
    removeCategory: (category: string) => void;
    updateCategory: (oldCategory: string, newCategory: string, color: string, type: 'normal' | 'credit') => void;
}

const defaultCategories: CategoryItem[] = [
    { name: "Housing", color: "#3B82F6", type: "normal" }, // blue-500
    { name: "Food", color: "#F59E0B", type: "normal" }, // amber-500
    { name: "Transport", color: "#10B981", type: "normal" }, // emerald-500
    { name: "Utilities", color: "#8B5CF6", type: "normal" }, // violet-500
    { name: "Entertainment", color: "#EC4899", type: "normal" }, // pink-500
    { name: "Other", color: "#6B7280", type: "normal" } // gray-500
];

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set) => ({
            categories: defaultCategories,
            addCategory: (category, color = "#6B7280", type = "normal") =>
                set((state) => ({
                    categories: [...state.categories, { name: category, color, type }],
                })),
            removeCategory: (category) =>
                set((state) => ({
                    categories: state.categories.filter((c) => c.name !== category),
                })),
            updateCategory: (oldCategory, newCategory, color, type) =>
                set((state) => ({
                    categories: state.categories.map((c) =>
                        c.name === oldCategory ? { name: newCategory, color, type } : { ...c, type: c.type || "normal" }
                    ),
                })),
        }),
        {
            name: "category-storage",
        }
    )
);
