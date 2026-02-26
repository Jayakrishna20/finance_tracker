import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { getWeeklyAnalytics, getMonthlyAnalytics, getYearlyAnalytics } from './queries';
import { WeeklyAnalyticsSchema, MonthlyAnalyticsSchema, YearlyAnalyticsSchema } from './schemas';

type WeeklyQuery = Static<typeof WeeklyAnalyticsSchema>;
type MonthlyQuery = Static<typeof MonthlyAnalyticsSchema>;
type YearlyQuery = Static<typeof YearlyAnalyticsSchema>;

const analyticsRoutes: FastifyPluginAsync = async (fastify) => {
    // GET /v1/analytics/weekly
    fastify.get<{ Querystring: WeeklyQuery }>(
        '/weekly',
        { schema: { querystring: WeeklyAnalyticsSchema } },
        async (request, reply) => {
            const { week, year } = request.query;
            const data = await getWeeklyAnalytics(fastify.prisma, week, year);
            return reply.send({ status: 'success', data });
        }
    );

    // GET /v1/analytics/monthly
    fastify.get<{ Querystring: MonthlyQuery }>(
        '/monthly',
        { schema: { querystring: MonthlyAnalyticsSchema } },
        async (request, reply) => {
            const { monthYear } = request.query;
            const data = await getMonthlyAnalytics(fastify.prisma, monthYear);
            return reply.send({ status: 'success', data });
        }
    );

    // GET /v1/analytics/yearly
    fastify.get<{ Querystring: YearlyQuery }>(
        '/yearly',
        { schema: { querystring: YearlyAnalyticsSchema } },
        async (request, reply) => {
            const { year } = request.query;
            const data = await getYearlyAnalytics(fastify.prisma, year);
            return reply.send({ status: 'success', data });
        }
    );
};

export default analyticsRoutes;
