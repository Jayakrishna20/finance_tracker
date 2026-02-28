import { FastifyRequest, FastifyReply } from 'fastify';
import { CategoryService } from './category.service.js';
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema.js';
import { successResponse } from '../../utils/responseBuilder.js';

export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    createCategory = async (
        request: FastifyRequest<{ Body: CreateCategoryInput }>,
        reply: FastifyReply
    ) => {
        await this.categoryService.createCategory(request.body);
        return reply.status(201).send(successResponse('Category created successfully'));
    };

    getAllCategories = async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const categories = await this.categoryService.getAllCategories();
        return reply.send(successResponse('Categories fetched successfully', categories));
    };

    getCategoryById = async (
        request: FastifyRequest<{ Params: { id: bigint } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const category = await this.categoryService.getCategoryById(id);
        return reply.send(successResponse('Category fetched successfully', category));
    };

    updateCategory = async (
        request: FastifyRequest<{ Params: { id: bigint }; Body: UpdateCategoryInput }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        await this.categoryService.updateCategory(id, request.body);
        return reply.send(successResponse('Category updated successfully'));
    };

    deleteCategory = async (
        request: FastifyRequest<{ Params: { id: bigint } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        await this.categoryService.deleteCategory(id);
        return reply.send(successResponse('Category deleted successfully'));
    };
}
