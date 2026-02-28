import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema.js';

export class CategoryService {
    constructor(private prisma: PrismaClient) { }

    async createCategory(data: CreateCategoryInput) {
        return this.prisma.category.create({
            data,
        });
    }

    async getAllCategories() {
        return this.prisma.category.findMany({
            select: {
                id: true,
                categoryName: true,
                categoryColorCode: true,
                categoryType: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getCategoryById(id: bigint) {
        return this.prisma.category.findUnique({
            select: {
                id: true,
                categoryName: true,
                categoryColorCode: true,
                categoryType: true,
            },
            where: { id },
        });
    }

    async updateCategory(id: bigint, data: UpdateCategoryInput) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async deleteCategory(id: bigint) {
        return this.prisma.category.delete({
            where: { id },
        });
    }
}
