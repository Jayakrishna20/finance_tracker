import { PrismaClient } from '@prisma/client';

export class CategoryTypeService {
    constructor(private prisma: PrismaClient) { }

    async getActiveCategoryTypes() {
        return this.prisma.categoryType.findMany({
            where: { isActive: true },
            orderBy: { categoryTypeName: 'asc' },
        });
    }
}
