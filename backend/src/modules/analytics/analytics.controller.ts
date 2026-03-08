import { FastifyRequest, FastifyReply } from "fastify";
import { AnalyticsService } from "./analytics.service.js";
import {
  WeeklyQueryInput,
  MonthlyQueryInput,
  YearlyQueryInput,
} from "./analytics.schema.js";
import { successResponse } from "../../utils/responseBuilder.js";

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  getWeekly = async (
    request: FastifyRequest<{ Querystring: WeeklyQueryInput }>,
    reply: FastifyReply,
  ) => {
    const analytics = await this.analyticsService.getWeeklyAnalytics(
      request.query,
    );
    return reply.send(
      successResponse("Weekly analytics fetched successfully", analytics),
    );
  };

  getMonthly = async (
    request: FastifyRequest<{ Querystring: MonthlyQueryInput }>,
    reply: FastifyReply,
  ) => {
    const analytics = await this.analyticsService.getMonthlyAnalytics(
      request.query,
    );
    return reply.send(
      successResponse("Monthly analytics fetched successfully", analytics),
    );
  };

  getYearly = async (
    request: FastifyRequest<{ Querystring: YearlyQueryInput }>,
    reply: FastifyReply,
  ) => {
    const analytics = await this.analyticsService.getYearlyAnalytics(
      request.query,
    );
    return reply.send(
      successResponse("Yearly analytics fetched successfully", analytics),
    );
  };

  getWeeklyCredits = async (
    request: FastifyRequest<{ Querystring: WeeklyQueryInput }>,
    reply: FastifyReply,
  ) => {
    const analytics = await this.analyticsService.getWeeklyCreditAnalytics(
      request.query,
    );
    return reply.send(
      successResponse(
        "Weekly credit analytics fetched successfully",
        analytics,
      ),
    );
  };

  getMonthlyCredits = async (
    request: FastifyRequest<{ Querystring: MonthlyQueryInput }>,
    reply: FastifyReply,
  ) => {
    const analytics = await this.analyticsService.getMonthlyCreditAnalytics(
      request.query,
    );
    return reply.send(
      successResponse(
        "Monthly credit analytics fetched successfully",
        analytics,
      ),
    );
  };

  getYearlyCredits = async (
    request: FastifyRequest<{ Querystring: YearlyQueryInput }>,
    reply: FastifyReply,
  ) => {
    const analytics = await this.analyticsService.getYearlyCreditAnalytics(
      request.query,
    );
    return reply.send(
      successResponse(
        "Yearly credit analytics fetched successfully",
        analytics,
      ),
    );
  };
}
