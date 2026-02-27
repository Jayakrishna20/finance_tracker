import { z } from 'zod';

export const CreateCategorySchema = z.object({
    categoryName: z.string().min(1).max(255),
    categoryType: z.enum(['INCOME', 'EXPENSE']),
    categoryColorCode: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color code. Must be #RRGGBB'),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export const CategoryParamsSchema = z.object({
    id: z.coerce.bigint({ message: 'Invalid category ID' }),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
