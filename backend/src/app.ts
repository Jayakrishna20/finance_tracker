import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { logger } from './config/logger.js';
import prismaPlugin from './plugins/prisma.js';
import errorHandler from './plugins/errorHandler.js';

import categoryRoutes from './modules/categories/category.routes.js';
import transactionRoutes from './modules/transactions/transaction.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import archiveRoutes from './modules/archive/archive.routes.js';
import categoryTypeRoutes from './modules/category-types/categoryType.routes.js';

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: logger as any,
        disableRequestLogging: true,
    });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    await app.register(helmet, { global: true });
    await app.register(cors, { origin: true });

    await app.register(prismaPlugin);
    await app.register(errorHandler);

    app.addHook('onRequest', (req, res, done) => {
        logger.info({ reqId: req.id, method: req.method, url: req.url }, 'Request received');
        done();
    });
    app.addHook('onResponse', (req, reply, done) => {
        if (reply.statusCode >= 400) {
            logger.error({ reqId: req.id, statusCode: reply.statusCode }, 'Request failed');
        } else {
            logger.info({ reqId: req.id, statusCode: reply.statusCode }, 'Response sent');
        }
        done();
    });

    await app.register(swagger, {
        openapi: {
            info: {
                title: 'Finance Tracker API',
                description: 'Finance Tracker documentation',
                version: '1.0.0',
            },
        },
        transform: jsonSchemaTransform,
    });

    await app.register(swaggerUi, {
        routePrefix: '/docs',
    });

    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    await app.register(categoryRoutes, { prefix: '/categories' });
    await app.register(transactionRoutes, { prefix: '/transactions' });
    await app.register(analyticsRoutes, { prefix: '/analytics' });
    await app.register(archiveRoutes, { prefix: '/archive' });
    await app.register(categoryTypeRoutes, { prefix: '/category-types' });

    return app;
};
