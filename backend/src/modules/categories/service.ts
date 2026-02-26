import { PrismaClient } from '@prisma/client';

export class CategoryService {
    constructor(private prisma: PrismaClient) { }

    async list() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async create(data: { name: string; type?: string }) {
        return this.prisma.category.create({
            data: {
                name: data.name,
                type: data.type || 'normal',
            },
        });
    }

    async update(id: string, data: { name?: string; type?: string }) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.category.delete({
            where: { id },
        });
    }
}
