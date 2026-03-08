import { FastifyRequest, FastifyReply } from "fastify";
import { ArchiveService } from "./archive.service.js";
import { successResponse } from "../../utils/responseBuilder.js";

export class ArchiveController {
  constructor(private archiveService: ArchiveService) {}

  getWeekly = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.archiveService.getWeeklyArchive();
    return reply.send(
      successResponse("Weekly archive fetched successfully", data),
    );
  };

  getMonthly = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.archiveService.getMonthlyArchive();
    return reply.send(
      successResponse("Monthly archive fetched successfully", data),
    );
  };

  getYearly = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.archiveService.getYearlyArchive();
    return reply.send(
      successResponse("Yearly archive fetched successfully", data),
    );
  };

  getWeeklyCredits = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.archiveService.getWeeklyCreditArchive();
    return reply.send(
      successResponse("Weekly credit archive fetched successfully", data),
    );
  };

  getMonthlyCredits = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.archiveService.getMonthlyCreditArchive();
    return reply.send(
      successResponse("Monthly credit archive fetched successfully", data),
    );
  };

  getYearlyCredits = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.archiveService.getYearlyCreditArchive();
    return reply.send(
      successResponse("Yearly credit archive fetched successfully", data),
    );
  };
}
