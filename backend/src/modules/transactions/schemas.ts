import { Type } from '@sinclair/typebox';

// Fastify natively works with JSON Schema. Typebox gives us TS types without duplication.

export const CreateTransactionSchema = Type.Object({
    userId: Type.String({ format: 'uuid' }), // Normally from JWT token, explicit here for v1 dev
    date: Type.String({ format: 'date-time' }), // Example: 2026-02-25T15:30:22.000Z
    categoryId: Type.String({ format: 'uuid' }),
    amount: Type.Integer(), // Amounts MUST be in cents (e.g., 1000 = $10.00)
    notes: Type.Optional(Type.String())
});

export const UpdateTransactionSchema = Type.Partial(CreateTransactionSchema);

export const QueryTransactionSchema = Type.Object({
    startDate: Type.Optional(Type.String({ format: 'date-time' })),
    endDate: Type.Optional(Type.String({ format: 'date-time' })),
    categoryId: Type.Optional(Type.String({ format: 'uuid' })),
    userId: Type.String({ format: 'uuid' }) // Again, normally an implicit JWT Context value
});

export const ParamsIdSchema = Type.Object({
    id: Type.String({ format: 'uuid' })
});
