import { FastifyPluginAsync } from 'fastify';
import { Type, Static } from '@sinclair/typebox';

const BaseArchiveSchema = Type.Object({
  userId: Type.String({ format: 'uuid' }),
  cursor: Type.Optional(Type.String()), // Cursor based pagination
  limit: Type.Optional(Type.Integer({ default: 10, maximum: 50 }))
});

type BaseArchive = Static<typeof BaseArchiveSchema>;

/**
 * Returns a list of past Aggregation periods (Weekly/Monthly/Yearly) sequentially.
 * In a production architecture querying an archive like this uses robust cursor pagination 
 * ordering heavily over indexes explicitly.
 */
const archiveRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /v1/archive/weekly
  fastify.get<{ Querystring: BaseArchive }>(
    '/weekly',
    { schema: { querystring: BaseArchiveSchema } },
    async (request, reply) => {
      const { userId, limit = 10, cursor } = request.query;

      // Group directly against the index pulling historical weeks sorted
      const result = await fastify.prisma.transaction.groupBy({
        by: ['weekNumber', 'year'],
        where: { userId },
        _sum: { amount: true },
        orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
        take: limit,
        // (Cursor mapping requires raw query execution if mapping across explicit grouped composites)
      });

      const processed = result.map((r: any) => ({
        period: `W${r.weekNumber}-${r.year}`,
        total: r._sum.amount || 0
      }));

      return reply.send({ status: 'success', data: processed });
    }
  );

  // GET /v1/archive/monthly
  fastify.get<{ Querystring: BaseArchive }>(
    '/monthly',
    { schema: { querystring: BaseArchiveSchema } },
    async (request, reply) => {
      const { userId, limit = 10 } = request.query;

      const result = await fastify.prisma.transaction.groupBy({
        by: ['monthYear'],
        where: { userId },
        _sum: { amount: true },
        orderBy: { monthYear: 'desc' }, // In prod logic: year-month format "2026-01" to sort correctly
        take: limit
      });

      const processed = result.map((r: any) => ({
        period: r.monthYear,
        total: r._sum.amount || 0
      }));

      return reply.send({ status: 'success', data: processed });
    }
  );

  // GET /v1/archive/yearly
  fastify.get<{ Querystring: BaseArchive }>(
    '/yearly',
    { schema: { querystring: BaseArchiveSchema } },
    async (request, reply) => {
      const { userId, limit = 10 } = request.query;

      const result = await fastify.prisma.transaction.groupBy({
        by: ['year'],
        where: { userId },
        _sum: { amount: true },
        orderBy: { year: 'desc' },
        take: limit
      });

      const processed = result.map((r: any) => ({
        period: `${r.year}`,
        total: r._sum.amount || 0
      }));

      return reply.send({ status: 'success', data: processed });
    }
  );
};

export default archiveRoutes;
