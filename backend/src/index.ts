import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

// Patch BigInt serialization for JSON.stringify
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

const start = async () => {
    try {
        const app = await buildApp();

        await app.listen({
            port: env.PORT,
            host: env.HOST,
        });

        logger.info(`🚀 Server listening on http://${env.HOST}:${env.PORT}`);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};

start();
