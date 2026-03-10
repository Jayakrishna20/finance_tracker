import { PrismaClient } from "@prisma/client/extension";
import { format } from "date-fns";
import type { TransactionRow, CreditRow } from "./email.service.js";

export class NotificationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Fetch all transactions for a given month/year from TransactionView.
   * Returns rows formatted for the email template.
   */
  async getMonthlyTransactions(
    year: number,
    month: number,
  ): Promise<{ rows: TransactionRow[]; totalPaise: number }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1); // exclusive upper bound

    const records = await this.prisma.transactionView.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    const rows: TransactionRow[] = records.map((r: any) => ({
      date: format(new Date(r.date), "dd MMM yyyy"),
      description: r.description ?? "",
      categoryName: r.categoryName,
      amount: Number(r.amount),
    }));

    const totalPaise = rows.reduce((sum, r) => sum + r.amount, 0);

    return { rows, totalPaise };
  }

  /**
   * Fetch credits whose billedDate is exactly the 15th of the given month/year.
   */
  async getCreditsDueOn15th(year: number, month: number): Promise<CreditRow[]> {
    // The 15th at midnight (start of day)
    const billedDate = new Date(year, month - 1, 15);
    const nextDay = new Date(year, month - 1, 16);

    const records = await this.prisma.credits.findMany({
      where: {
        billedDate: {
          gte: billedDate,
          lt: nextDay,
        },
      },
      include: {
        category: {
          select: { categoryName: true },
        },
      },
      orderBy: { billedDate: "asc" },
    });

    return records.map((r: any) => ({
      description: r.description,
      categoryName: r.category.categoryName,
      amount: Number(r.amount),
      billedDate: format(new Date(r.billedDate), "dd MMM yyyy"),
      paymentDate: format(new Date(r.paymentDate), "dd MMM yyyy"),
      paidStatus: r.paidStatus,
    }));
  }
}
