export interface Category {
    id: string;
    name: string;
    type: string;
    userId: string;
}

export interface Transaction {
    id: string;
    date: string; // ISO String
    categoryId: string;
    category: Category;
    amount: number;
    notes?: string;

    // Auto-calculated fields
    dayName: string;
    weekNumber: number;
    monthYear: string;
}
