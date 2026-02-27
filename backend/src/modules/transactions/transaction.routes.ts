import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { TransactionController } from './transaction.controller.js';
import { TransactionService } from './transaction.service.js';
import {
    CreateTransactionSchema,
    UpdateTransactionSchema,
    TransactionParamsSchema,
    TransactionQuerySchema,
} from './transaction.schema.js';

const transactionRoutes: FastifyPluginAsyncZod = async (fastify) => {
    const transactionService = new TransactionService(fastify.prisma);
    const transactionController = new TransactionController(transactionService);

    fastify.post(
        '/',
        {
            schema: {
                body: CreateTransactionSchema,
                tags: ['Transactions'],
            },
        },
        transactionController.createTransaction
    );

    fastify.get(
        '/',
        {
            schema: {
                querystring: TransactionQuerySchema,
                tags: ['Transactions'],
            },
        },
        transactionController.getTransactions
    );

    fastify.put(
        '/:id',
        {
            schema: {
                params: TransactionParamsSchema,
                body: UpdateTransactionSchema,
                tags: ['Transactions'],
            },
        },
        transactionController.updateTransaction
    );

    fastify.delete(
        '/:id',
        {
            schema: {
                params: TransactionParamsSchema,
                tags: ['Transactions'],
            },
        },
        transactionController.deleteTransaction
    );
};

export default transactionRoutes;
