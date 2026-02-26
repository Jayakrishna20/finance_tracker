import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { TransactionService } from './service';
import { CreateTransactionSchema, UpdateTransactionSchema, TransactionQuerySchema, TransactionIdParamsSchema } from './schemas';

type CreateTransaction = Static<typeof CreateTransactionSchema>;
type UpdateTransaction = Static<typeof UpdateTransactionSchema>;
type TransactionQuery = Static<typeof TransactionQuerySchema>;
type TransactionIdParams = Static<typeof TransactionIdParamsSchema>;

const transactionRoutes: FastifyPluginAsync = async (fastify) => {
    const service = new TransactionService(fastify.prisma);

    // GET /v1/transactions
    fastify.get<{ Querystring: TransactionQuery }>(
        '/',
        { schema: { querystring: TransactionQuerySchema } },
        async (request, reply) => {
            const transactions = await service.getFiltered(request.query);
            return reply.send({ status: 'success', data: transactions });
        }
    );

    // POST /v1/transactions
    fastify.post<{ Body: CreateTransaction }>(
        '/',
        { schema: { body: CreateTransactionSchema } },
        async (request, reply) => {
            const transaction = await service.create(request.body);
            return reply.code(201).send({ status: 'success', data: transaction });
        }
    );

    // PATCH /v1/transactions/:id
    fastify.patch<{ Params: TransactionIdParams; Body: UpdateTransaction }>(
        '/:id',
        { schema: { params: TransactionIdParamsSchema, body: UpdateTransactionSchema } },
        async (request, reply) => {
            const { id } = request.params;
            const transaction = await service.update(id, request.body);
            return reply.send({ status: 'success', data: transaction });
        }
    );

    // DELETE /v1/transactions/:id
    fastify.delete<{ Params: TransactionIdParams }>(
        '/:id',
        { schema: { params: TransactionIdParamsSchema } },
        async (request, reply) => {
            const { id } = request.params;
            await service.delete(id);
            return reply.send({ status: 'success', message: 'Transaction deleted' });
        }
    );
};

export default transactionRoutes;
