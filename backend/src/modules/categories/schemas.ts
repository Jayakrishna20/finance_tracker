import { Type } from '@sinclair/typebox';

export const CreateCategorySchema = Type.Object({
    name: Type.String(),
    type: Type.Optional(Type.String({ default: 'normal' })),
    userId: Type.String({ format: 'uuid' })
});

export const QueryCategorySchema = Type.Object({
    userId: Type.String({ format: 'uuid' })
});
