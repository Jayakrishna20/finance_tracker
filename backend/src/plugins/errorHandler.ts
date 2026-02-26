import fp from 'fastify-plugin';

export default fp(async (fastify) => {
    fastify.setErrorHandler((error: any, request, reply) => {
        fastify.log.error(error);

        // TypeBox/AJV Validation Error
        if (error.validation) {
            return reply.status(400).send({
                error: "Bad Request",
                message: "Schema validation failed",
                details: error.validation
            });
        }

        // Prisma Record Not Found
        if (error.code === 'P2025') {
            return reply.status(404).send({ error: "Not Found", message: "Record not found" });
        }

        // Default error catch-all
        return reply.status(500).send({ error: "Internal Server Error", message: "Something went wrong" });
    });
});
