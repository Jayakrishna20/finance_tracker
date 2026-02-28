import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryTypeService } from './categoryType.service.js';
import { successResponse } from '../../utils/responseBuilder.js';

export class CategoryTypeController {
    constructor(private categoryTypeService: CategoryTypeService) { }

    getActiveCategoryTypes = async (request: FastifyRequest, reply: FastifyReply) => {
        const types = await this.categoryTypeService.getActiveCategoryTypes();
        return reply.send(successResponse('Category types fetched successfully', types));
    }
}
