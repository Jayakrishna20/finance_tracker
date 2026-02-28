import { FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from './analytics.service.js';
import {
    WeeklyQueryInput,
    MonthlyQueryInput,
    YearlyQueryInput,
} from './analytics.schema.js';
import { successResponse } from '../../utils/responseBuilder.js';

export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    getWeekly = async (request: FastifyRequest<{ Querystring: WeeklyQueryInput }>, reply: FastifyReply) => {
        const { categories, grandTotal } = await this.analyticsService.getWeeklyAnalytics(request.query);
        return reply.send(successResponse('Weekly analytics fetched successfully', categories, { grandTotal }));
    };

    getMonthly = async (request: FastifyRequest<{ Querystring: MonthlyQueryInput }>, reply: FastifyReply) => {
        const { categories, grandTotal } = await this.analyticsService.getMonthlyAnalytics(request.query);
        return reply.send(successResponse('Monthly analytics fetched successfully', categories, { grandTotal }));
    };

    getYearly = async (request: FastifyRequest<{ Querystring: YearlyQueryInput }>, reply: FastifyReply) => {
        const { categories, grandTotal } = await this.analyticsService.getYearlyAnalytics(request.query);
        return reply.send(successResponse('Yearly analytics fetched successfully', categories, { grandTotal }));
    };
}
