import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { startScheduler } from "./modules/notifications/scheduler.js";
import { PrismaClient } from "@prisma/client";

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

    const prisma = new PrismaClient();
    startScheduler(prisma);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
