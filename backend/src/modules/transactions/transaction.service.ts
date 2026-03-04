import { PrismaClient, Prisma } from "@prisma/client";
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
    const { categoryTypeId, skip, take } = query;

    let where: Prisma.TransactionViewWhereInput | undefined = undefined;

    if (categoryTypeId) {
      const categoryType = await this.prisma.categoryTypes.findUnique({
        where: { categoryTypeId },
      });
      if (categoryType) {
        where = {
          categoryTypeName: categoryType.categoryTypeName,
        };
      }
    }

    const [total, data] = await Promise.all([
      this.prisma.transactionView.count({ where }),
      this.prisma.transactionView.findMany({
        where,
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

  async getTransactionById(transactionId: bigint) {
    return this.prisma.transactions.findUnique({
      where: { transactionId },
      select: {
        transactionId: true,
        amount: true,
        date: true,
        description: true,
        category: {
          select: {
            categoryId: true,
            categoryName: true,
            categoryColorCode: true,
          },
        },
      },
    });
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
