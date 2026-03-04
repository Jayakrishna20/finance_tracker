import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CreditController } from "./credit.controller.js";
import { CreditService } from "./credit.service.js";
import {
  CreateCreditSchema,
  UpdateCreditSchema,
  CreditParamsSchema,
} from "./credit.schema.js";

const creditRoutes: FastifyPluginAsyncZod = async (fastify) => {
  const creditService = new CreditService(fastify.prisma);
  const creditController = new CreditController(creditService);

  fastify.post(
    "/",
    {
      schema: {
        body: CreateCreditSchema,
        tags: ["Credits"],
        summary: "Create a new credit",
      },
    },
    creditController.createCredit,
  );

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Credits"],
        summary: "Get all credits",
      },
    },
    creditController.getAllCredits,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        params: CreditParamsSchema,
        tags: ["Credits"],
        summary: "Get a credit by ID",
      },
    },
    creditController.getCreditById,
  );

  fastify.put(
    "/:id",
    {
      schema: {
        params: CreditParamsSchema,
        body: UpdateCreditSchema,
        tags: ["Credits"],
        summary: "Update a credit",
      },
    },
    creditController.updateCredit,
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: CreditParamsSchema,
        tags: ["Credits"],
        summary: "Delete a credit",
      },
    },
    creditController.deleteCredit,
  );
};

export default creditRoutes;
