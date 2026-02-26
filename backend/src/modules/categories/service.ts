import { PrismaClient } from '@prisma/client';

export class CategoryService {
    constructor(private prisma: PrismaClient) { }

    async list(userId: string) {
        return this.prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        });
    }

    async create(data: { userId: string, name: string, type?: string }) {
        return this.prisma.category.create({
            data: {
                userId: data.userId,
                name: data.name,
                type: data.type || 'normal'
            }
        });
    }

    async seedDefaults(userId: string) {
        const defaults = [
            "Housing",
            "Food",
            "Transport",
            "Utilities",
            "Entertainment",
            "Other"
        ];

        return Promise.all(
            defaults.map(name =>
                this.prisma.category.upsert({
                    where: { userId_name: { userId, name } },
                    update: {},
                    create: { userId, name, type: 'normal' }
                })
            )
        );
    }
}
