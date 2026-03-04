import { PrismaClient } from "@prisma/client";
import { CreateCreditInput, UpdateCreditInput } from "./credit.schema.js";

export class CreditService {
  constructor(private prisma: PrismaClient) {}

  async createCredit(data: CreateCreditInput) {
    return this.prisma.credits.create({
      data,
    });
  }

  async getAllCredits() {
    return this.prisma.credits.findMany({
      include: {
        category: {
          select: {
            categoryId: true,
            categoryName: true,
            categoryColorCode: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
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

  async deleteCredit(creditId: bigint) {
    return this.prisma.credits.delete({
      where: { creditId },
    });
  }
}
