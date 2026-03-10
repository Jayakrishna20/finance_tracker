import { PrismaClient } from "../../generated/prisma/index.js";

export class ArchiveService {
  constructor(private prisma: PrismaClient) {}

  async getWeeklyArchive() {
    return this.prisma.$queryRaw`
      SELECT
        date_trunc('week', t."date") AS period,
        t."categoryId",
        c."categoryName",
        CAST(SUM(t.amount) AS INTEGER) AS total,
        CAST(SUM(SUM(t.amount)) OVER (PARTITION BY date_trunc('week', t."date")) AS INTEGER) AS "periodTotal"
      FROM "Transactions" t
      JOIN "Categories" c ON t."categoryId" = c."categoryId"
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
      FROM "Transactions" t
      JOIN "Categories" c ON t."categoryId" = c."categoryId"
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
      FROM "Transactions" t
      JOIN "Categories" c ON t."categoryId" = c."categoryId"
      GROUP BY 1, 2, 3
      ORDER BY 1 DESC;
    `;
  }

  async getWeeklyCreditArchive() {
    return this.prisma.$queryRaw`
      SELECT
        date_trunc('week', cr."billedDate") AS period,
        cr."categoryId",
        c."categoryName",
        CAST(SUM(cr.amount) AS INTEGER) AS total,
        CAST(SUM(SUM(cr.amount)) OVER (PARTITION BY date_trunc('week', cr."billedDate")) AS INTEGER) AS "periodTotal"
      FROM "Credits" cr
      JOIN "Categories" c ON cr."categoryId" = c."categoryId"
      GROUP BY 1, 2, 3
      ORDER BY 1 DESC;
    `;
  }

  async getMonthlyCreditArchive() {
    return this.prisma.$queryRaw`
      SELECT
        date_trunc('month', cr."billedDate") AS period,
        cr."categoryId",
        c."categoryName",
        CAST(SUM(cr.amount) AS INTEGER) AS total,
        CAST(SUM(SUM(cr.amount)) OVER (PARTITION BY date_trunc('month', cr."billedDate")) AS INTEGER) AS "periodTotal"
      FROM "Credits" cr
      JOIN "Categories" c ON cr."categoryId" = c."categoryId"
      GROUP BY 1, 2, 3
      ORDER BY 1 DESC;
    `;
  }

  async getYearlyCreditArchive() {
    return this.prisma.$queryRaw`
      SELECT
        date_trunc('year', cr."billedDate") AS period,
        cr."categoryId",
        c."categoryName",
        CAST(SUM(cr.amount) AS INTEGER) AS total,
        CAST(SUM(SUM(cr.amount)) OVER (PARTITION BY date_trunc('year', cr."billedDate")) AS INTEGER) AS "periodTotal"
      FROM "Credits" cr
      JOIN "Categories" c ON cr."categoryId" = c."categoryId"
      GROUP BY 1, 2, 3
      ORDER BY 1 DESC;
    `;
  }
}
