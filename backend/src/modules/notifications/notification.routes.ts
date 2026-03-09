import { FastifyInstance } from "fastify";
import { format } from "date-fns";
import { z } from "zod";
import { NotificationService } from "./notification.service.js";
import {
  sendEmail,
  buildMonthlyTransactionEmail,
  buildCreditsBillingEmail,
} from "./email.service.js";
import { successResponse } from "../../utils/responseBuilder.js";

/**
 * Dev-only routes for triggering notification emails on demand.
 * Register these only when NODE_ENV !== "production".
 *
 * Optional query params: ?year=2026&month=3
 */
export default async function notificationRoutes(app: FastifyInstance) {
  const notificationService = new NotificationService(app.prisma);

  // POST /notifications/trigger/monthly-summary
  app.post("/trigger/monthly-summary", {
    schema: {
      summary: "Trigger monthly transaction summary email",
      querystring: z.object({
        year: z.coerce.number().int().optional(),
        month: z.coerce.number().int().min(1).max(12).optional(),
      }),
    },
    handler: async (request, reply) => {
      const query = request.query as { year?: number; month?: number };
      const now = new Date();
      const year = query.year ?? now.getFullYear();
      const month = query.month ?? now.getMonth() + 1;
      const monthName = format(new Date(year, month - 1, 1), "MMMM");

      const { rows, totalPaise } =
        await notificationService.getMonthlyTransactions(year, month);
      const html = buildMonthlyTransactionEmail(
        monthName,
        year,
        rows,
        totalPaise,
      );
      await sendEmail(`Finance Summary – ${monthName} ${year}`, html);

      return reply.send(
        successResponse(
          `Monthly summary email sent for ${monthName} ${year} (${rows.length} transactions)`,
        ),
      );
    },
  });

  // POST /notifications/trigger/credits-billing
  app.post("/trigger/credits-billing", {
    schema: {
      summary: "Trigger credits billing reminder email",
      querystring: z.object({
        year: z.coerce.number().int().optional(),
        month: z.coerce.number().int().min(1).max(12).optional(),
      }),
    },
    handler: async (request, reply) => {
      const query = request.query as { year?: number; month?: number };
      const now = new Date();
      const year = query.year ?? now.getFullYear();
      const month = query.month ?? now.getMonth() + 1;
      const monthName = format(new Date(year, month - 1, 1), "MMMM");

      const rows = await notificationService.getCreditsDueOn15th(year, month);
      const html = buildCreditsBillingEmail(monthName, year, rows);
      await sendEmail(`Credits Due – ${monthName} ${year}`, html);

      return reply.send(
        successResponse(
          `Credits billing email sent for ${monthName} ${year} (${rows.length} credits)`,
        ),
      );
    },
  });
}
