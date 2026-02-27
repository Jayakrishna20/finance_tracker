import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CategoryTypeService } from './categoryType.service.js';

export class CategoryTypeController {
    private service: CategoryTypeService;

    constructor(prisma: PrismaClient) {
        this.service = new CategoryTypeService(prisma);
    }

    async getActiveCategoryTypes(req: FastifyRequest, reply: FastifyReply) {
        try {
            const types = await this.service.getActiveCategoryTypes();
            const serializedTypes = types.map(t => ({
                ...t,
                id: String(t.id)
            }));

            reply.status(200).send(serializedTypes);
        } catch (error) {
            req.server.log.error(error);
            reply.status(500).send({ message: 'Internal Server Error' });
        }
    }
}
