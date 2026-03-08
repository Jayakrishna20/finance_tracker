import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsService } from "./analytics.service.js";
import {
  WeeklyAnalyticsQuery,
  MonthlyAnalyticsQuery,
  YearlyAnalyticsQuery,
} from "./analytics.schema.js";

const analyticsRoutes: FastifyPluginAsyncZod = async (fastify) => {
  const analyticsService = new AnalyticsService(fastify.prisma);
  const analyticsController = new AnalyticsController(analyticsService);

  fastify.get(
    "/weekly",
    {
      schema: {
        querystring: WeeklyAnalyticsQuery,
        tags: ["Analytics"],
      },
    },
    analyticsController.getWeekly,
  );

  fastify.get(
    "/monthly",
    {
      schema: {
        querystring: MonthlyAnalyticsQuery,
        tags: ["Analytics"],
      },
    },
    analyticsController.getMonthly,
  );

  fastify.get(
    "/yearly",
    {
      schema: {
        querystring: YearlyAnalyticsQuery,
        tags: ["Analytics"],
      },
    },
    analyticsController.getYearly,
  );

  fastify.get(
    "/credits/weekly",
    {
      schema: {
        querystring: WeeklyAnalyticsQuery,
        tags: ["Analytics"],
      },
    },
    analyticsController.getWeeklyCredits,
  );

  fastify.get(
    "/credits/monthly",
    {
      schema: {
        querystring: MonthlyAnalyticsQuery,
        tags: ["Analytics"],
      },
    },
    analyticsController.getMonthlyCredits,
  );

  fastify.get(
    "/credits/yearly",
    {
      schema: {
        querystring: YearlyAnalyticsQuery,
        tags: ["Analytics"],
      },
    },
    analyticsController.getYearlyCredits,
  );
};

export default analyticsRoutes;
