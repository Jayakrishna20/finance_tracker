export const TransactionTypes = {
    Normal: 1,
    Credit: 2
} as const;

export type TransactionType =
    (typeof TransactionTypes)[keyof typeof TransactionTypes];

export interface Category {
    categoryId: number;
    categoryName: string;
    categoryType: TransactionType;
    categoryColorCode: string;
    type: CategoryTypeName
}

export interface CategoryTypeName {
    categoryTypeName: string;
}

export interface Transaction {
    transactionId: number;
    type: TransactionType;
    date: string;
    category?: Category;
    amount: number;
    description: string;
    dayName?: string;
    weekNumber?: number;
    monthYear?: string;
}

export type CreateCategoryPayload = Omit<Category, 'CategoryId'>;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CreateTransactionPayload = {
    type: TransactionType,
    date: string,
    amount: number,
    categoryId?: number,
    description: string,
}
export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface DailyTransactionsGridProps {
    type?: TransactionType;
}