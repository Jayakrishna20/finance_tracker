import { Type } from '@sinclair/typebox';

export const CategorySchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    type: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
});

export const CreateCategorySchema = Type.Object({
    name: Type.String(),
    type: Type.Optional(Type.String({ default: 'normal' })),
});

export const UpdateCategorySchema = Type.Partial(CreateCategorySchema);

export const CategoryIdParamsSchema = Type.Object({
    id: Type.String(),
});
