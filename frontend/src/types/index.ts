export const TransactionTypes = {
  Cash: 1,
  Credit: 2,
} as const;

export type TransactionType =
  (typeof TransactionTypes)[keyof typeof TransactionTypes];

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryType: TransactionType;
  categoryColorCode: string;
  type: CategoryTypeName;
}

export interface CategoryTypeName {
  categoryTypeName: string;
}

export interface Transaction {
  transactionId: number;
  amount: number;
  date: string;
  description: string;
  categoryId: number;
  categoryName: string;
  categoryColorCode: string;
  categoryTypeName: string;
  dayName?: string;
  weekNumber?: number;
  monthYear?: string;
}

export type CreateCategoryPayload = Omit<Category, "categoryId">;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CreateTransactionPayload = {
  type: TransactionType;
  date: string;
  amount: number;
  categoryId?: number;
  description: string;
};
export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface DailyTransactionsGridProps {
  type?: TransactionType;
}

export interface Credit {
  creditId: number;
  description: string;
  categoryId: number;
  categoryName: string;
  categoryColorCode: string;
  amount: number;
  billedDate: string;
  lastPaymentDate: string;
  paidStatus: boolean;
  paymentDate: string;
}

export type CreateCreditPayload = {
  description: string;
  categoryId: number;
  billedDate: string;
  lastPaymentDate: string;
  paidStatus: boolean;
  paymentDate: string;
  amount: number;
};

export type UpdateCreditPayload = Partial<CreateCreditPayload>;
