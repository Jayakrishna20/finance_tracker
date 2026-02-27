import { PrismaClient } from '@prisma/client';
import { startOfISOWeek, endOfISOWeek, setISOWeek, setYear, startOfMonth, endOfMonth, startOfYear, endOfYear, setMonth } from 'date-fns';
import { WeeklyQueryInput, MonthlyQueryInput, YearlyQueryInput } from './analytics.schema.js';

export class AnalyticsService {
    constructor(private prisma: PrismaClient) { }

    private async getAggregatedData(startDate: Date, endDate: Date) {
        const grouped = await this.prisma.transaction.groupBy({
            by: ['categoryId'],
            _sum: {
                amount: true,
            },
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        if (grouped.length === 0) {
            return { categories: [], grandTotal: 0 };
        }

        const categoryIds = grouped.map((g) => g.categoryId);
        const categories = await this.prisma.category.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, categoryName: true },
        });

        const categoryMap = new Map(categories.map((c) => [c.id, c.categoryName]));

        let grandTotal = 0;
        const formattedCategories = grouped.map((g) => {
            const total = g._sum.amount || 0;
            grandTotal += total;
            return {
                categoryId: g.categoryId,
                categoryName: categoryMap.get(g.categoryId) || 'Unknown',
                total,
            };
        });

        return {
            categories: formattedCategories,
            grandTotal,
        };
    }

    async getWeeklyAnalytics(query: WeeklyQueryInput) {
        let baseDate = setYear(new Date(), query.year);
        baseDate = setISOWeek(baseDate, query.week);

        const startDate = startOfISOWeek(baseDate);
        const endDate = endOfISOWeek(baseDate);

        return this.getAggregatedData(startDate, endDate);
    }

    async getMonthlyAnalytics(query: MonthlyQueryInput) {
        let baseDate = setYear(new Date(), query.year);
        baseDate = setMonth(baseDate, query.month - 1);

        const startDate = startOfMonth(baseDate);
        const endDate = endOfMonth(baseDate);

        return this.getAggregatedData(startDate, endDate);
    }

    async getYearlyAnalytics(query: YearlyQueryInput) {
        let baseDate = setYear(new Date(), query.year);

        const startDate = startOfYear(baseDate);
        const endDate = endOfYear(baseDate);

        return this.getAggregatedData(startDate, endDate);
    }
}
