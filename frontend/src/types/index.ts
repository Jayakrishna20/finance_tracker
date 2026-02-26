export type TransactionCategory = string;

export interface Transaction {
    id: string;
    type: 'normal' | 'credit';
    date: string; // ISO String
    categoryId: string;
    category: TransactionCategory;
    amount: number;
    notes?: string;

    // Auto-calculated fields
    dayName: string;
    weekNumber: number;
    monthYear: string;
}
