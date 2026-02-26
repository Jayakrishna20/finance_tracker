import { FastifyPluginAsync } from 'fastify';
import { Type, Static } from '@sinclair/typebox';

const BaseArchiveSchema = Type.Object({
  cursor: Type.Optional(Type.String()), // Cursor based pagination
  limit: Type.Optional(Type.Integer({ default: 10, maximum: 50 }))
});

type BaseArchive = Static<typeof BaseArchiveSchema>;

/**
 * Returns a list of past Aggregation periods (Weekly/Monthly/Yearly) sequentially.
 * Since we removed denormalized fields, we use raw SQL to group by date parts.
 */
const archiveRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /v1/archive/weekly
  fastify.get<{ Querystring: BaseArchive }>(
    '/weekly',
    { schema: { querystring: BaseArchiveSchema } },
    async (request, reply) => {
      const { limit = 10 } = request.query;

      // Group by ISO Week using Postgres date_trunc
      const result: any[] = await fastify.prisma.$queryRaw`
        SELECT 
          EXTRACT(ISOYEAR FROM date) as year,
          EXTRACT(WEEK FROM date) as "weekNumber",
          SUM(amount) as total
        FROM transactions
        GROUP BY year, "weekNumber"
        ORDER BY year DESC, "weekNumber" DESC
        LIMIT ${limit}
      `;

      const processed = result.map((r: any) => ({
        period: `W${r.weekNumber}-${r.year}`,
        total: Number(r.total) || 0
      }));

      return reply.send({ status: 'success', data: processed });
    }
  );

  // GET /v1/archive/monthly
  fastify.get<{ Querystring: BaseArchive }>(
    '/monthly',
    { schema: { querystring: BaseArchiveSchema } },
    async (request, reply) => {
      const { limit = 10 } = request.query;

      const result: any[] = await fastify.prisma.$queryRaw`
        SELECT 
          TO_CHAR(date, 'Mon-YYYY') as "monthYear",
          SUM(amount) as total,
          DATE_TRUNC('month', date) as sort_month
        FROM transactions
        GROUP BY "monthYear", sort_month
        ORDER BY sort_month DESC
        LIMIT ${limit}
      `;

      const processed = result.map((r: any) => ({
        period: r.monthYear,
        total: Number(r.total) || 0
      }));

      return reply.send({ status: 'success', data: processed });
    }
  );

  // GET /v1/archive/yearly
  fastify.get<{ Querystring: BaseArchive }>(
    '/yearly',
    { schema: { querystring: BaseArchiveSchema } },
    async (request, reply) => {
      const { limit = 10 } = request.query;

      const result: any[] = await fastify.prisma.$queryRaw`
        SELECT 
          EXTRACT(YEAR FROM date) as year,
          SUM(amount) as total
        FROM transactions
        GROUP BY year
        ORDER BY year DESC
        LIMIT ${limit}
      `;

      const processed = result.map((r: any) => ({
        period: `${r.year}`,
        total: Number(r.total) || 0
      }));

      return reply.send({ status: 'success', data: processed });
    }
  );
};

export default archiveRoutes;
