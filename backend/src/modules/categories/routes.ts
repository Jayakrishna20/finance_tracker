import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { CategoryService } from './service';
import { CreateCategorySchema, UpdateCategorySchema, CategoryIdParamsSchema } from './schemas';

type CreateCategory = Static<typeof CreateCategorySchema>;
type UpdateCategory = Static<typeof UpdateCategorySchema>;
type CategoryIdParams = Static<typeof CategoryIdParamsSchema>;

const categoryRoutes: FastifyPluginAsync = async (fastify) => {
    const service = new CategoryService(fastify.prisma);

    // GET /v1/categories
    fastify.get('/', async (request, reply) => {
        const categories = await service.list();
        return reply.send({ status: 'success', data: categories });
    });

    // POST /v1/categories
    fastify.post<{ Body: CreateCategory }>(
        '/',
        { schema: { body: CreateCategorySchema } },
        async (request, reply) => {
            const category = await service.create(request.body);
            return reply.code(201).send({ status: 'success', data: category });
        }
    );

    // PATCH /v1/categories/:id
    fastify.patch<{ Params: CategoryIdParams; Body: UpdateCategory }>(
        '/:id',
        { schema: { params: CategoryIdParamsSchema, body: UpdateCategorySchema } },
        async (request, reply) => {
            const { id } = request.params;
            const category = await service.update(id, request.body);
            return reply.send({ status: 'success', data: category });
        }
    );

    // DELETE /v1/categories/:id
    fastify.delete<{ Params: CategoryIdParams }>(
        '/:id',
        { schema: { params: CategoryIdParamsSchema } },
        async (request, reply) => {
            const { id } = request.params;
            await service.delete(id);
            return reply.send({ status: 'success', message: 'Category deleted' });
        }
    );
};

export default categoryRoutes;
