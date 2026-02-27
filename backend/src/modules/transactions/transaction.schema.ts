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
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof TransactionQuerySchema>;
