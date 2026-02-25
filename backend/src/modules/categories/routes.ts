import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { CategoryService } from './service';
import { CreateCategorySchema, QueryCategorySchema } from './schemas';

type CreateCategory = Static<typeof CreateCategorySchema>;
type QueryCategory = Static<typeof QueryCategorySchema>;

const categoryRoutes: FastifyPluginAsync = async (fastify, options) => {
    const service = new CategoryService(fastify.prisma);

    // GET /v1/categories?userId=...
    fastify.get<{ Querystring: QueryCategory }>(
        '/',
        { schema: { querystring: QueryCategorySchema } },
        async (request, reply) => {
            const categories = await service.list(request.query.userId);

            // If none found for user, seed defaults for demo purposes
            if (categories.length === 0) {
                await service.seedDefaults(request.query.userId);
                const seeded = await service.list(request.query.userId);
                return reply.status(200).send({ status: 'success', data: seeded });
            }

            return reply.status(200).send({ status: 'success', data: categories });
        }
    );

    // POST /v1/categories
    fastify.post<{ Body: CreateCategory }>(
        '/',
        { schema: { body: CreateCategorySchema } },
        async (request, reply) => {
            const newCategory = await service.create(request.body);
            return reply.status(201).send({ status: 'success', data: newCategory });
        }
    );
};

export default categoryRoutes;
