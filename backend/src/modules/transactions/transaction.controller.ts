import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionService } from './transaction.service.js';
import {
    CreateTransactionInput,
    UpdateTransactionInput,
    TransactionQueryInput,
} from './transaction.schema.js';
import { successResponse } from '../../utils/responseBuilder.js';

export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    createTransaction = async (
        request: FastifyRequest<{ Body: CreateTransactionInput }>,
        reply: FastifyReply
    ) => {
        const transaction = await this.transactionService.createTransaction(request.body);
        return reply.status(201).send(successResponse(transaction, 'Transaction created successfully'));
    };

    getTransactions = async (
        request: FastifyRequest<{ Querystring: TransactionQueryInput }>,
        reply: FastifyReply
    ) => {
        const result = await this.transactionService.getTransactions(request.query);
        return reply.send({ success: true, ...result });
    };

    updateTransaction = async (
        request: FastifyRequest<{ Params: { id: bigint }; Body: UpdateTransactionInput }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const transaction = await this.transactionService.updateTransaction(id, request.body);
        return reply.send(successResponse(transaction, 'Transaction updated successfully'));
    };

    deleteTransaction = async (
        request: FastifyRequest<{ Params: { id: bigint } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        await this.transactionService.deleteTransaction(id);
        return reply.send(successResponse(null, 'Transaction deleted successfully'));
    };
}
