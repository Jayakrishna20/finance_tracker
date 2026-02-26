export interface Category {
    id: string;
    name: string;
    type: 'normal' | 'credit';
    color?: string;
}

export interface Transaction {
    id: string;
    type: 'normal' | 'credit';
    date: string; // ISO String
    categoryId: string;
    category: Category;
    amount: number;
    description: string
}
