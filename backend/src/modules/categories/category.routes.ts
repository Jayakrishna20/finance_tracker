import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CategoryController } from './category.controller.js';
import { CategoryService } from './category.service.js';
import {
    CreateCategorySchema,
    UpdateCategorySchema,
    CategoryParamsSchema,
} from './category.schema.js';

const categoryRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const categoryService = new CategoryService(fastify.prisma);
    const categoryController = new CategoryController(categoryService);

    fastify.post(
        '/',
        {
            schema: {
                body: CreateCategorySchema,
                tags: ['Categories'],
                summary: 'Create a new category',
            },
        },
        categoryController.createCategory
    );

    fastify.get(
        '/',
        {
            schema: {
                tags: ['Categories'],
                summary: 'Get all categories',
            },
        },
        categoryController.getAllCategories
    );

    fastify.put(
        '/:id',
        {
            schema: {
                params: CategoryParamsSchema,
                body: UpdateCategorySchema,
                tags: ['Categories'],
                summary: 'Update a category',
            },
        },
        categoryController.updateCategory
    );

    fastify.delete(
        '/:id',
        {
            schema: {
                params: CategoryParamsSchema,
                tags: ['Categories'],
                summary: 'Delete a category',
            },
        },
        categoryController.deleteCategory
    );
};

export default categoryRoutes;
