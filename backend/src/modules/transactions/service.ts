import { PrismaClient, Prisma } from '@prisma/client';

export class TransactionService {
    constructor(private prisma: PrismaClient) { }

    async create(data: { date: string, categoryId: string, amount: number, notes?: string }) {
        return this.prisma.transaction.create({
            data: {
                date: new Date(data.date),
                categoryId: data.categoryId,
                amount: data.amount,
                notes: data.notes,
            }
        });
    }

    async getFiltered(filters: { startDate?: string, endDate?: string, categoryId?: string }) {
        const whereClause: Prisma.TransactionWhereInput = {};

        if (filters.startDate || filters.endDate) {
            whereClause.date = {};
            if (filters.startDate) whereClause.date.gte = new Date(filters.startDate);
            if (filters.endDate) whereClause.date.lte = new Date(filters.endDate);
        }

        if (filters.categoryId) {
            whereClause.categoryId = filters.categoryId;
        }

        return this.prisma.transaction.findMany({
            where: whereClause,
            include: { category: true },
            orderBy: { date: 'desc' },
            take: 100 // Hard cap memory on generic finds
        });
    }

    async update(id: string, data: { date?: string, categoryId?: string, amount?: number, notes?: string }) {
        const updateData: Prisma.TransactionUpdateInput = {};
        if (data.date) updateData.date = new Date(data.date);
        if (data.categoryId) updateData.category = { connect: { id: data.categoryId } };
        if (data.amount !== undefined) updateData.amount = data.amount;
        if (data.notes !== undefined) updateData.notes = data.notes;

        return this.prisma.transaction.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        return this.prisma.transaction.delete({
            where: { id }
        });
    }
}
