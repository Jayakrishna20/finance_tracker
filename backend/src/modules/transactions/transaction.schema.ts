import { z } from 'zod';

export const CreateTransactionSchema = z.object({
    date: z.coerce.date(),
    amount: z.number().describe('Amount in decimal, will be rounded to nearest whole number internally'),
    description: z.string().optional(),
    categoryId: z.coerce.bigint({ message: 'Invalid category ID' }),
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export const TransactionParamsSchema = z.object({
    id: z.coerce.bigint({ message: 'Invalid transaction ID' }),
});

export const TransactionQuerySchema = z.object({
    categoryTypeName: z.string().optional(),
    skip: z.coerce.number().min(0).default(0),
    take: z.coerce.number().min(1).max(100).default(10),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof TransactionQuerySchema>;
