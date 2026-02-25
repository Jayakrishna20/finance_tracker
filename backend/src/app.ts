import fastify, { FastifyInstance } from 'fastify';
import prismaPlugin from './plugins/prisma';
import errorHandler from './plugins/errorHandler';
import transactionRoutes from './modules/transactions/routes';
import analyticsRoutes from './modules/analytics/routes';
import categoryRoutes from './modules/categories/routes';

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = fastify({ logger: true });

    // 1. Core Plugins
    await app.register(prismaPlugin);
    await app.register(errorHandler);

    // 2. Domain Routes
    await app.register(transactionRoutes, { prefix: '/v1/transactions' });
    await app.register(analyticsRoutes, { prefix: '/v1/analytics' });
    await app.register(categoryRoutes, { prefix: '/v1/categories' });
    // await app.register(archiveRoutes, { prefix: '/v1/archive' });

    return app;
};
