import { Prisma, PrismaClient } from "@prisma/client";
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
    const { skip, take } = query;

    let where: Prisma.CreditsWhereInput | undefined = undefined;

    const [total, data] = await Promise.all([
      this.prisma.credits.count({ where }),
      this.prisma.credits.findMany({
        where,
        orderBy: { createdAt: "desc" },
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
