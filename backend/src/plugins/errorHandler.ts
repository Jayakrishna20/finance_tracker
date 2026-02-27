import fp from 'fastify-plugin';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

export default fp(async (fastify) => {
    fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
        logger.error({ err: error, reqId: request.id }, error.message);

        if (error instanceof ZodError) {
            return reply.status(400).send({
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
        }

        if (error.statusCode) {
            return reply.status(error.statusCode).send({
                success: false,
                message: error.message,
            });
        }

        if (error.code && error.code.startsWith('P')) {
            if (error.code === 'P2002') {
                return reply.status(409).send({
                    success: false,
                    message: 'Unique constraint failed on the database',
                });
            }
            if (error.code === 'P2025') {
                return reply.status(404).send({
                    success: false,
                    message: 'Record not found',
                });
            }
        }

        reply.status(500).send({
            success: false,
            message: 'Internal Server Error',
        });
    });
});
