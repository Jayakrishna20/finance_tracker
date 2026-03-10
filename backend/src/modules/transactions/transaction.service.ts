import { PrismaClient } from "../../generated/prisma/index.js";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionQueryInput,
} from "./transaction.schema.js";

export class TransactionService {
  constructor(private prisma: PrismaClient) {}

  async createTransaction(data: CreateTransactionInput) {
    return this.prisma.transactions.create({
      data: {
        ...data,
        amount: Math.round(data.amount),
      },
      include: {
        category: true,
      },
    });
  }

  async getTransactions(query: TransactionQueryInput) {
    const skip = query.skip !== undefined ? Number(query.skip) : 0;
    const take = query.take !== undefined ? Number(query.take) : 10;

    const [total, data] = await Promise.all([
      this.prisma.transactionView.count(),
      this.prisma.transactionView.findMany({
        orderBy: { date: "desc" },
        skip,
        take,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  async updateTransaction(transactionId: bigint, data: UpdateTransactionInput) {
    const updateData: any = { ...data };
    if (data.amount !== undefined) {
      updateData.amount = Math.round(data.amount);
    }
    return this.prisma.transactions.update({
      where: { transactionId },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async deleteTransaction(transactionId: bigint) {
    return this.prisma.transactions.delete({
      where: { transactionId },
    });
  }
}
