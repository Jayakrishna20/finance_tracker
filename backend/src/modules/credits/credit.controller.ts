import { FastifyRequest, FastifyReply } from "fastify";
import { CreditService } from "./credit.service.js";
import { CreateCreditInput, UpdateCreditInput } from "./credit.schema.js";
import { successResponse } from "../../utils/responseBuilder.js";

export class CreditController {
  constructor(private creditService: CreditService) {}

  createCredit = async (
    request: FastifyRequest<{ Body: CreateCreditInput }>,
    reply: FastifyReply,
  ) => {
    await this.creditService.createCredit(request.body);
    return reply
      .status(201)
      .send(successResponse("Credit created successfully"));
  };

  getAllCredits = async (request: FastifyRequest, reply: FastifyReply) => {
    const credits = await this.creditService.getAllCredits();
    return reply.send(successResponse("Credits fetched successfully", credits));
  };

  getCreditById = async (
    request: FastifyRequest<{ Params: { id: bigint } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const credit = await this.creditService.getCreditById(id);
    if (!credit) {
      return reply
        .status(404)
        .send({ success: false, message: "Credit not found" });
    }
    return reply.send(successResponse("Credit fetched successfully", credit));
  };

  updateCredit = async (
    request: FastifyRequest<{
      Params: { id: bigint };
      Body: UpdateCreditInput;
    }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    await this.creditService.updateCredit(id, request.body);
    return reply.send(successResponse("Credit updated successfully"));
  };

  deleteCredit = async (
    request: FastifyRequest<{ Params: { id: bigint } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    await this.creditService.deleteCredit(id);
    return reply.send(successResponse("Credit deleted successfully"));
  };
}
