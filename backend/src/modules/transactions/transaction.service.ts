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
        const { from, to, page, limit } = query;

        const where: Prisma.TransactionWhereInput = {};
        if (from || to) {
            where.date = {};
            if (from) where.date.gte = from;
            if (to) where.date.lte = to;
        }

        const [total, data] = await Promise.all([
            this.prisma.transaction.count({ where }),
            this.prisma.transaction.findMany({
                where,
                orderBy: { date: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: true,
                },
            }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getTransactionById(id: bigint) {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: {
                category: true,
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
