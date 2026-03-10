import { PrismaClient } from "@prisma/client/extension";
import {
  startOfISOWeek,
  endOfISOWeek,
  setISOWeek,
  setYear,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  setMonth,
} from "date-fns";
import {
  WeeklyQueryInput,
  MonthlyQueryInput,
  YearlyQueryInput,
} from "./analytics.schema.js";

export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  private async getAggregatedData(startDate: Date, endDate: Date) {
    const grouped = await this.prisma.transactions.groupBy({
      by: ["categoryId"],
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

    const categoryIds = grouped.map((g: any) => g.categoryId);
    const categories = await this.prisma.categories.findMany({
      where: { categoryId: { in: categoryIds } },
      select: { categoryId: true, categoryName: true },
    });

    const categoryMap = new Map(
      categories.map((c: any) => [c.categoryId, c.categoryName]),
    );

    let grandTotal = 0;
    const formattedCategories = grouped.map((g: any) => {
      const total = g._sum.amount || 0;
      grandTotal += Number(total);
      return {
        categoryId: g.categoryId,
        categoryName: categoryMap.get(g.categoryId),
        total: Number(total),
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

  private async getCreditAggregatedData(startDate: Date, endDate: Date) {
    const grouped = await this.prisma.credits.groupBy({
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
      where: {
        billedDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (grouped.length === 0) {
      return { categories: [], grandTotal: 0 };
    }
    const categoryIds = grouped.map((g: any) => g.categoryId);
    const categories = await this.prisma.categories.findMany({
      where: { categoryId: { in: categoryIds } },
      select: { categoryId: true, categoryName: true },
    });

    const categoryMap = new Map(
      categories.map((c: any) => [c.categoryId, c.categoryName]),
    );

    let grandTotal = 0;
    const formattedCategories = grouped.map((g: any) => {
      const total = g._sum.amount || 0;
      grandTotal += Number(total);
      return {
        categoryId: g.categoryId,
        categoryName: categoryMap.get(g.categoryId),
        total: Number(total),
      };
    });

    return { categories: formattedCategories, grandTotal };
  }

  async getWeeklyCreditAnalytics(query: WeeklyQueryInput) {
    let baseDate = setYear(new Date(), query.year);
    baseDate = setISOWeek(baseDate, query.week);

    const startDate = startOfISOWeek(baseDate);
    const endDate = endOfISOWeek(baseDate);

    return this.getCreditAggregatedData(startDate, endDate);
  }

  async getMonthlyCreditAnalytics(query: MonthlyQueryInput) {
    let baseDate = setYear(new Date(), query.year);
    baseDate = setMonth(baseDate, query.month - 1);

    const startDate = startOfMonth(baseDate);
    const endDate = endOfMonth(baseDate);

    return this.getCreditAggregatedData(startDate, endDate);
  }

  async getYearlyCreditAnalytics(query: YearlyQueryInput) {
    let baseDate = setYear(new Date(), query.year);

    const startDate = startOfYear(baseDate);
    const endDate = endOfYear(baseDate);

    return this.getCreditAggregatedData(startDate, endDate);
  }
}
