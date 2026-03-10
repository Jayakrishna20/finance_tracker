import { PrismaClient } from "../../generated/prisma/index.js";
import {
  CreateCreditInput,
  CreditQueryInput,
  UpdateCreditInput,
} from "./credit.schema.js";

export class CreditService {
  constructor(private prisma: PrismaClient) {}

  async createCredit(data: CreateCreditInput) {
    return this.prisma.credits.create({
      data,
    });
  }

  async getAllCredits(query: CreditQueryInput) {
    const skip = query.skip !== undefined ? Number(query.skip) : 0;
    const take = query.take !== undefined ? Number(query.take) : 10;

    const [total, data] = await Promise.all([
      this.prisma.creditView.count(),
      this.prisma.creditView.findMany({
        orderBy: { paymentDate: "desc" },
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

  async getCreditById(creditId: bigint) {
    return this.prisma.credits.findUnique({
      include: {
        category: {
          select: {
            categoryId: true,
            categoryName: true,
            categoryColorCode: true,
          },
        },
      },
      where: { creditId },
    });
  }

  async updateCredit(creditId: bigint, data: UpdateCreditInput) {
    return this.prisma.credits.update({
      where: { creditId },
      data,
    });
  }

  async updateCreditStatus(creditIds: bigint[], paidStatus: boolean) {
    return this.prisma.credits.updateMany({
      where: {
        creditId: {
          in: creditIds,
        },
      },
      data: { paidStatus },
    });
  }

  async deleteCredit(creditId: bigint) {
    return this.prisma.credits.delete({
      where: { creditId },
    });
  }
}
