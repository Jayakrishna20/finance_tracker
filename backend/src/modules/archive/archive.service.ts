import { PrismaClient } from '@prisma/client';

export class ArchiveService {
    constructor(private prisma: PrismaClient) { }

    async getWeeklyArchive() {
        return this.prisma.$queryRaw`
      SELECT
        date_trunc('week', t."date") AS period,
        t."categoryId",
        c."categoryName",
        CAST(SUM(t.amount) AS INTEGER) AS total,
        CAST(SUM(SUM(t.amount)) OVER (PARTITION BY date_trunc('week', t."date")) AS INTEGER) AS "periodTotal"
      FROM "Transaction" t
      JOIN "Category" c ON t."categoryId" = c.id
      GROUP BY 1, 2, 3
      ORDER BY 1 DESC;
    `;
    }

    async getMonthlyArchive() {
        return this.prisma.$queryRaw`
      SELECT
        date_trunc('month', t."date") AS period,
        t."categoryId",
        c."categoryName",
        CAST(SUM(t.amount) AS INTEGER) AS total,
        CAST(SUM(SUM(t.amount)) OVER (PARTITION BY date_trunc('month', t."date")) AS INTEGER) AS "periodTotal"
      FROM "Transaction" t
      JOIN "Category" c ON t."categoryId" = c.id
      GROUP BY 1, 2, 3
      ORDER BY 1 DESC;
    `;
    }

    async getYearlyArchive() {
        return this.prisma.$queryRaw`
      SELECT
        date_trunc('year', t."date") AS period,
        t."categoryId",
        c."categoryName",
        CAST(SUM(t.amount) AS INTEGER) AS total,
        CAST(SUM(SUM(t.amount)) OVER (PARTITION BY date_trunc('year', t."date")) AS INTEGER) AS "periodTotal"
      FROM "Transaction" t
      JOIN "Category" c ON t."categoryId" = c.id
      GROUP BY 1, 2, 3
      ORDER BY 1 DESC;
    `;
    }
}
