import { FastifyRequest, FastifyReply } from 'fastify';
import { ArchiveService } from './archive.service.js';
import { successResponse } from '../../utils/responseBuilder.js';

// Convert SQL raw resulting objects (which might have BigInts or strange objects) to normal format if needed, but Fastify serializer handles standard stuff.
// Prisma returns BigInt for sums sometimes depending on driver, so Fastify needs BigInt parsing or we format string.
// We explicitly CAST as INTEGER in the SQL query, so it guarantees standard numbers.
export class ArchiveController {
    constructor(private archiveService: ArchiveService) { }

    getWeekly = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await this.archiveService.getWeeklyArchive();
        return reply.send(successResponse(data));
    };

    getMonthly = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await this.archiveService.getMonthlyArchive();
        return reply.send(successResponse(data));
    };

    getYearly = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = await this.archiveService.getYearlyArchive();
        return reply.send(successResponse(data));
    };
}
