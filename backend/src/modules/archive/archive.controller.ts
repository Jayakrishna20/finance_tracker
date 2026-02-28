import { FastifyRequest, FastifyReply } from 'fastify';
import { ArchiveService } from './archive.service.js';
import { successResponse } from '../../utils/responseBuilder.js';

export class ArchiveController {
    constructor(private archiveService: ArchiveService) { }

    getWeekly = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await this.archiveService.getWeeklyArchive();
        return reply.send(successResponse('Weekly archive fetched successfully', data));
    };

    getMonthly = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await this.archiveService.getMonthlyArchive();
        return reply.send(successResponse('Monthly archive fetched successfully', data));
    };

    getYearly = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await this.archiveService.getYearlyArchive();
        return reply.send(successResponse('Yearly archive fetched successfully', data));
    };
}
