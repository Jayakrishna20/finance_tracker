import { FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import { TransactionService } from './service';
import { CreateTransactionSchema, ParamsIdSchema, QueryTransactionSchema } from './schemas';

// Note: Requires Fastify 5+ type resolution logic for body schemas
// Because type inference requires complex utility types, we'll cast explicit `Request` types or use `fastify.post<...>` 
import { Static } from '@sinclair/typebox';

type CreateTx = Static<typeof CreateTransactionSchema>;
type QueryTx = Static<typeof QueryTransactionSchema>;
type ParamsTx = Static<typeof ParamsIdSchema>;

const transactionRoutes: FastifyPluginAsync = async (fastify, options) => {
    const service = new TransactionService(fastify.prisma);

    // POST /v1/transactions
    fastify.post<{ Body: CreateTx }>(
        '/',
        { schema: { body: CreateTransactionSchema } },
        async (request, reply) => {
            // In a real app the user's timezone config would come from decoded JWT/DB profile
            // For this SaaS V1 demo, assume explicit configuration headers pass timezone or fallback to UTC
            const userTimezoneHeader = (request.headers['x-user-timezone'] as string) || 'UTC';

            const newTransaction = await service.create(request.body, userTimezoneHeader);
            return reply.status(201).send({ status: 'success', data: newTransaction });
        }
    );

    // GET /v1/transactions
    fastify.get<{ Querystring: QueryTx }>(
        '/',
        { schema: { querystring: QueryTransactionSchema } },
        async (request, reply) => {
            // In prod `userId` MUST come from \`request.user.id\` context injected by JWT Plugin
            // Passed over Query params uniquely here for isolated module testing
            const transactions = await service.getFiltered(request.query);
            return reply.status(200).send({ status: 'success', data: transactions });
        }
    );

    // DELETE /v1/transactions/:id
    fastify.delete<{ Params: ParamsTx }>(
        '/:id',
        { schema: { params: ParamsIdSchema } },
        async (request, reply) => {
            // In production `userId` would be forced from Context JWT
            const userId = (request.headers['x-user-id'] as string) || 'DEMO-USER';

            await service.delete(request.params.id, userId);
            return reply.status(200).send({ status: 'success', message: 'Transaction Deleted Successfully' });
        }
    );
};

export default transactionRoutes;
