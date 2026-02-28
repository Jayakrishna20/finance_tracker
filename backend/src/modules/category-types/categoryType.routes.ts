import { FastifyInstance } from 'fastify';
import { CategoryTypeController } from './categoryType.controller.js';
import { CategoryTypeService } from './categoryType.service.js';

export default async function categoryTypeRoutes(app: FastifyInstance) {
    const categoryTypeService = new CategoryTypeService(app.prisma);
    const categoryTypeController = new CategoryTypeController(categoryTypeService);

    app.get(
        '/',
        {
            schema: {
                tags: ['CategoryTypes'],
                description: 'Get all active category types',
            },
        },
        categoryTypeController.getActiveCategoryTypes
    );
}
