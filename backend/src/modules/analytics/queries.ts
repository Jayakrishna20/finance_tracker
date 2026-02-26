import { PrismaClient } from '@prisma/client';
import { startOfYear, endOfYear, startOfMonth, endOfMonth, startOfISOWeek, endOfISOWeek, parse } from 'date-fns';

export async function getWeeklyAnalytics(prisma: PrismaClient, week: number, year: number) {
  // ISO Weeks are tricky to parse directly, simpler to iterate if we don't have a helper.
  // We'll construct a date that definitely falls in that week/year.
  // Note: This is an approximation of the week range.
  const dateInWeek = parse(`${year}-W${week}-1`, "I'RRRR-'W'II-i", new Date());
  const startDate = startOfISOWeek(dateInWeek);
  const endDate = endOfISOWeek(dateInWeek);

  const [categoryTotals, grandTotalAgg] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    }),

    prisma.transaction.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    })
  ]);

  const categoryIds = categoryTotals.map((c: any) => c.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } }
  });
  const categoryMap = Object.fromEntries(categories.map((c: any) => [c.id, c.name]));

  return {
    period: `W${week}-${year}`,
    categories: categoryTotals.map((c: any) => ({
      categoryId: c.categoryId,
      category: categoryMap[c.categoryId] || 'Unknown',
      total: c._sum.amount || 0
    })),
    grandTotal: grandTotalAgg._sum.amount || 0
  };
}

export async function getMonthlyAnalytics(prisma: PrismaClient, monthYear: string) {
  // monthYear is in format 'MMM-yyyy' (e.g., Oct-2026)
  const dateInMonth = parse(monthYear, 'MMM-yyyy', new Date());
  const startDate = startOfMonth(dateInMonth);
  const endDate = endOfMonth(dateInMonth);

  const [categoryTotals, grandTotalAgg] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    }),
    prisma.transaction.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    })
  ]);

  const categoryIds = categoryTotals.map((c: any) => c.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } }
  });
  const categoryMap = Object.fromEntries(categories.map((c: any) => [c.id, c.name]));

  return {
    period: monthYear,
    categories: categoryTotals.map((c: any) => ({
      categoryId: c.categoryId,
      category: categoryMap[c.categoryId] || 'Unknown',
      total: c._sum.amount || 0
    })),
    grandTotal: grandTotalAgg._sum.amount || 0
  };
}

export async function getYearlyAnalytics(prisma: PrismaClient, year: number) {
  const dateInYear = parse(`${year}`, 'yyyy', new Date());
  const startDate = startOfYear(dateInYear);
  const endDate = endOfYear(dateInYear);

  const [categoryTotals, grandTotalAgg] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    }),
    prisma.transaction.aggregate({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    })
  ]);

  const categoryIds = categoryTotals.map((c: any) => c.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } }
  });
  const categoryMap = Object.fromEntries(categories.map((c: any) => [c.id, c.name]));

  return {
    period: `${year}`,
    categories: categoryTotals.map((c: any) => ({
      categoryId: c.categoryId,
      category: categoryMap[c.categoryId] || 'Unknown',
      total: c._sum.amount || 0
    })),
    grandTotal: grandTotalAgg._sum.amount || 0
  };
}
