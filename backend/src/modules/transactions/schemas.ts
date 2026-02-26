import { Type } from '@sinclair/typebox';

export const TransactionSchema = Type.Object({
    id: Type.String(),
    date: Type.String({ format: 'date-time' }),
    categoryId: Type.String(),
    amount: Type.Integer(),
    notes: Type.Optional(Type.String()),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
});

export const CreateTransactionSchema = Type.Object({
    date: Type.String(),
    categoryId: Type.String(),
    amount: Type.Integer(),
    notes: Type.Optional(Type.String()),
});

export const UpdateTransactionSchema = Type.Partial(CreateTransactionSchema);

export const TransactionQuerySchema = Type.Object({
    startDate: Type.Optional(Type.String()),
    endDate: Type.Optional(Type.String()),
    categoryId: Type.Optional(Type.String()),
});

export const TransactionIdParamsSchema = Type.Object({
    id: Type.String(),
});
