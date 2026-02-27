import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
    const prisma = new PrismaClient({
        datasourceUrl: env.DATABASE_URL,
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    await prisma.$connect();

    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
};

export default fp(prismaPlugin);
