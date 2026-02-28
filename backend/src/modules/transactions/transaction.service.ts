import { PrismaClient, Prisma } from '@prisma/client';
import {
    CreateTransactionInput,
    UpdateTransactionInput,
    TransactionQueryInput,
} from './transaction.schema.js';

export class TransactionService {
    constructor(private prisma: PrismaClient) { }

    async createTransaction(data: CreateTransactionInput) {
        return this.prisma.transaction.create({
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
        const { categoryTypeName, skip, take } = query;

        const where: Prisma.TransactionWhereInput = {};
        if (categoryTypeName) {
            where.category = {
                type: {
                    categoryTypeName
                }
            };
        }

        const [total, data] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.findMany({
                where,
                orderBy: { date: 'desc' },
                skip,
                take,
                select: {
                    id: true,
                    amount: true,
                    date: true,
                    description: true,
                    category: {
                        select: {
                            id: true,
                            categoryName: true,
                            categoryColorCode: true,
                        }
                    }
                }
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

    async getTransactionById(id: bigint) {
        return this.prisma.transaction.findUnique({
            where: { id },
            select: {
                id: true,
                amount: true,
                date: true,
                description: true,
                category: {
                    select: {
                        id: true,
                        categoryName: true,
                        categoryColorCode: true,
                    }
                }
            },
        });
    }

    async updateTransaction(id: bigint, data: UpdateTransactionInput) {
        const updateData: any = { ...data };
        if (data.amount !== undefined) {
            updateData.amount = Math.round(data.amount);
        }
        return this.prisma.transaction.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
            },
        });
    }

    async deleteTransaction(id: bigint) {
        return this.prisma.transaction.delete({
            where: { id },
        });
    }
}
