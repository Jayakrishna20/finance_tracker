import { FastifyReply, FastifyRequest } from "fastify";
import { successResponse } from "../../utils/responseBuilder.js";
import {
  CreateCreditInput,
  CreditQueryInput,
  UpdateCreditInput, // Import new params input
  UpdateCreditStatusBodyInput,
  UpdateCreditStatusParamsInput, // Import new params input
} from "./credit.schema.js";
import { CreditService } from "./credit.service.js";

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

  getAllCredits = async (
    request: FastifyRequest<{ Querystring: CreditQueryInput }>,
    reply: FastifyReply,
  ) => {
    const { data, meta } = await this.creditService.getAllCredits(
      request.query,
    );
    return reply.send(
      successResponse("Credits fetched successfully", data, meta),
    );
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

  updateCreditStatus = async (
    request: FastifyRequest<{
      Params: UpdateCreditStatusParamsInput;
      Body: UpdateCreditStatusBodyInput;
    }>,
    reply: FastifyReply,
  ) => {
    const { paidStatus } = request.params;
    const { ids } = request.body;

    const bigIntIds = ids.map((id) => BigInt(id));

    await this.creditService.updateCreditStatus(bigIntIds, paidStatus);
    return reply.send(successResponse("Credit status updated successfully"));
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
