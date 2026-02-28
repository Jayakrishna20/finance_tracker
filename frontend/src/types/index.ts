export type TransactionType = 'Normal' | 'Credit';

export interface Category {
    id: string;
    categoryName: string;
    categoryType: TransactionType;
    categoryColorCode: string;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    date: string; // ISO String
    categoryId: string;
    category?: Category;
    amount: number;
    description: string;

    // Derived/UI fields
    dayName?: string;
    weekNumber?: number;
    monthYear?: string;
}

export type CreateCategoryPayload = Omit<Category, 'id'>;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CreateTransactionPayload = Omit<Transaction, 'id' | 'category' | 'dayName' | 'weekNumber' | 'monthYear'>;
export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface DailyTransactionsGridProps {
    type?: TransactionType;
}