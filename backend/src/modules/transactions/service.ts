import { PrismaClient, Prisma } from '@prisma/client';
import { getDateDimensions } from '../../utils/date';

export class TransactionService {
    constructor(private prisma: PrismaClient) { }

    async create(data: { userId: string, date: string, categoryId: string, amount: number, notes?: string }, timezone: string = 'UTC') {
        const dimensions = getDateDimensions(data.date, timezone);

        return this.prisma.transaction.create({
            data: {
                userId: data.userId,
                date: dimensions.date,
                categoryId: data.categoryId,
                amount: data.amount,
                notes: data.notes,

                // Push computed date values mapped directly into Postgres explicitly
                dayName: dimensions.dayName,
                weekNumber: dimensions.weekNumber,
                monthYear: dimensions.monthYear,
                year: dimensions.year
            }
        });
    }

    async getFiltered(filters: { userId: string, startDate?: string, endDate?: string, categoryId?: string }) {
        const whereClause: Prisma.TransactionWhereInput = {
            userId: filters.userId
        };

        if (filters.startDate || filters.endDate) {
            whereClause.date = {};
            if (filters.startDate) whereClause.date.gte = new Date(filters.startDate);
            if (filters.endDate) whereClause.date.lte = new Date(filters.endDate);
        }

        if (filters.categoryId) {
            whereClause.categoryId = filters.categoryId;
        }

        // Leveraging @@index([userId, date(sort: Desc)])
        return this.prisma.transaction.findMany({
            where: whereClause,
            include: { category: true },
            orderBy: { date: 'desc' },
            take: 100 // Hard cap memory on generic finds
        });
    }

    async delete(id: string, userId: string) {
        return this.prisma.transaction.delete({
            where: { id, userId } // Ensure user ownership at Database Level
        });
    }
}
