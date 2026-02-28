import { PrismaClient } from '@prisma/client';

export class CategoryTypeService {
    constructor(private prisma: PrismaClient) { }

    async getActiveCategoryTypes() {
        return this.prisma.categoryType.findMany({
            select: {
                id: true,
                categoryTypeName: true,
                isActive: true,
            },
            where: { isActive: true },
            orderBy: { categoryTypeName: 'asc' },
        });
    }
}
