export type TransactionType = 'normal' | 'credit';

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
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
