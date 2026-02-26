import { PrismaClient } from '@prisma/client';

/**
 * All database operations encapsulate heavy logic executing precisely around 
 * @@index constraints initialized during Schema creation. 
 * Operations occur purely in PostgreSQL DB natively preventing excessive runtime memory.
 */

export async function getWeeklyAnalytics(prisma: PrismaClient, userId: string, week: number, year: number) {
  const [categoryTotals, grandTotalAgg] = await Promise.all([
    // Grouping by explicit integer index
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, weekNumber: week, year },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    }),

    // Aggregating Grand Total
    prisma.transaction.aggregate({
      where: { userId, weekNumber: week, year },
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

export async function getMonthlyAnalytics(prisma: PrismaClient, userId: string, monthYear: string) {
  // Leverages @@index([userId, monthYear]) directly instead of casting `DATE_TRUNC()` logic.
  const [categoryTotals, grandTotalAgg] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, monthYear },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    }),
    prisma.transaction.aggregate({
      where: { userId, monthYear },
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

export async function getYearlyAnalytics(prisma: PrismaClient, userId: string, year: number) {
  const [categoryTotals, grandTotalAgg] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, year },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    }),
    prisma.transaction.aggregate({
      where: { userId, year },
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
