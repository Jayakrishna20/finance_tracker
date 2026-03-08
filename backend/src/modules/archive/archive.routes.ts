import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ArchiveController } from "./archive.controller.js";
import { ArchiveService } from "./archive.service.js";

const archiveRoutes: FastifyPluginAsyncZod = async (fastify) => {
  const archiveService = new ArchiveService(fastify.prisma);
  const archiveController = new ArchiveController(archiveService);

  fastify.get("/weekly", archiveController.getWeekly);
  fastify.get("/monthly", archiveController.getMonthly);
  fastify.get("/yearly", archiveController.getYearly);

  // Credits archive routes
  fastify.get("/credits/weekly", archiveController.getWeeklyCredits);
  fastify.get("/credits/monthly", archiveController.getMonthlyCredits);
  fastify.get("/credits/yearly", archiveController.getYearlyCredits);
};

export default archiveRoutes;
