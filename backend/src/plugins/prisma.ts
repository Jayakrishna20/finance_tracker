import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

export interface PrismaPluginOptions {
    // Empty for now, but good for future extensions
}

export default fp<PrismaPluginOptions>(async (fastify, options) => {
    const prisma = new PrismaClient({
        log: ['error', 'warn'],
    });

    await prisma.$connect();

    // Make Prisma Client available throughout the Fastify instance
    fastify.decorate('prisma', prisma);

    // Close Prisma connection gracefully when Fastify stops
    fastify.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
