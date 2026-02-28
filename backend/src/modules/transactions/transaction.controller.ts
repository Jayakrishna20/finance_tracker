import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionService } from './transaction.service.js';
import { CreateTransactionInput, UpdateTransactionInput, TransactionQueryInput } from './transaction.schema.js';
import { successResponse } from '../../utils/responseBuilder.js';

export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    createTransaction = async (
        request: FastifyRequest<{ Body: CreateTransactionInput }>,
        reply: FastifyReply
    ) => {
        await this.transactionService.createTransaction(request.body);
        return reply.status(201).send(successResponse('Transaction created successfully'));
    };

    getTransactions = async (
        request: FastifyRequest<{ Querystring: TransactionQueryInput }>,
        reply: FastifyReply
    ) => {
        const { data, meta } = await this.transactionService.getTransactions(request.query);
        return reply.send(successResponse('Transactions fetched successfully', data, meta));
    };

    updateTransaction = async (
        request: FastifyRequest<{ Params: { id: bigint }; Body: UpdateTransactionInput }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        await this.transactionService.updateTransaction(id, request.body);
        return reply.send(successResponse('Transaction updated successfully'));
    };

    deleteTransaction = async (
        request: FastifyRequest<{ Params: { id: bigint } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        await this.transactionService.deleteTransaction(id);
        return reply.send(successResponse('Transaction deleted successfully'));
    };
}
