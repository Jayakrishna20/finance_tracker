import { FastifyInstance } from 'fastify';
import { CategoryTypeController } from './categoryType.controller.js';

export default async function categoryTypeRoutes(app: FastifyInstance) {
    const controller = new CategoryTypeController(app.prisma);

    app.get(
        '/',
        {
            schema: {
                tags: ['CategoryTypes'],
                description: 'Get all active category types',
            },
        },
        controller.getActiveCategoryTypes.bind(controller)
    );
}
