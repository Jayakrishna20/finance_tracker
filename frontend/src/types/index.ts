export type TransactionCategory =
    | 'Housing'
    | 'Food'
    | 'Transport'
    | 'Utilities'
    | 'Entertainment'
    | 'Other';

export interface Transaction {
    id: string;
    date: string; // ISO String
    category: TransactionCategory;
    amount: number;
    description?: string;

    // Auto-calculated fields
    dayName: string;
    weekNumber: number;
    monthYear: string;
}
