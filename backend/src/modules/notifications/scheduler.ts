import cron from "node-cron";
import { PrismaClient } from "@prisma/client/extension";
import { format } from "date-fns";
import { NotificationService } from "./notification.service.js";
import {
  sendEmail,
  buildMonthlyTransactionEmail,
  buildCreditsBillingEmail,
} from "./email.service.js";
import { logger } from "../../config/logger.js";

export function startScheduler(prisma: PrismaClient): void {
  const notificationService = new NotificationService(prisma);

  // -------------------------------------------------------------------------
  // Job 1: Monthly transaction summary — last day of each month at 08:00
  //
  // node-cron does NOT support the "L" (last-day) shorthand. Instead we run
  // every day at 08:00 and check whether TODAY is the last day of the month.
  // -------------------------------------------------------------------------
  cron.schedule("0 8 * * *", async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // If tomorrow is the 1st, today is the last day of the month
    if (tomorrow.getDate() !== 1) return;

    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1-indexed
    const monthName = format(today, "MMMM");

    try {
      logger.info(
        `[Scheduler] Sending monthly transaction summary for ${monthName} ${year}`,
      );
      const { rows, totalPaise } =
        await notificationService.getMonthlyTransactions(year, month);
      const html = buildMonthlyTransactionEmail(
        monthName,
        year,
        rows,
        totalPaise,
      );
      await sendEmail(`Finance Summary – ${monthName} ${year}`, html);
      logger.info(`[Scheduler] Monthly summary email sent successfully`);
    } catch (err) {
      logger.error({ err }, `[Scheduler] Failed to send monthly summary email`);
    }
  });

  // -------------------------------------------------------------------------
  // Job 2: Credits billing reminder — 15th of each month at 08:00
  // -------------------------------------------------------------------------
  cron.schedule("0 8 15 * *", async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const monthName = format(today, "MMMM");

    try {
      logger.info(
        `[Scheduler] Sending credits billing reminder for ${monthName} ${year}`,
      );
      const rows = await notificationService.getCreditsDueOn15th(year, month);
      const html = buildCreditsBillingEmail(monthName, year, rows);
      await sendEmail(`Credits Due – ${monthName} ${year}`, html);
      logger.info(`[Scheduler] Credits billing email sent successfully`);
    } catch (err) {
      logger.error({ err }, `[Scheduler] Failed to send credits billing email`);
    }
  });

  logger.info(
    "✅ Scheduler started: monthly-summary (last day of month @ 08:00)",
  );
  logger.info("✅ Scheduler started: credits-billing (15th of month @ 08:00)");
}
