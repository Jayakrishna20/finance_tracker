import cron from "node-cron";
import webpush from "web-push";
import { PrismaClient } from "@prisma/client";
import { logger } from "../../config/logger.js";

export function initPushScheduler(prisma: PrismaClient) {
  // Run at 11:30 AM on Saturday (6) and Sunday (0)
  cron.schedule("30 11 * * 0,6", async () => {
    logger.info("Running scheduled weekly push notification job");
    try {
      const subscriptions = await prisma.pushSubscriptions.findMany();

      if (subscriptions.length === 0) {
        logger.info("No push subscriptions found to notify.");
        return;
      }

      const payload = JSON.stringify({
        title: "TrackMint Weekly Reminder",
        body: "Hey! Just a reminder to log your expenses for this week.",
        icon: "/trackmint.svg",
      });

      const promises = subscriptions.map((sub: any) =>
        webpush
          .sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload,
          )
          .catch(async (err: any) => {
            if (err.statusCode === 404 || err.statusCode === 410) {
              logger.warn(
                `Subscription expired or invalid, removing: ${sub.id}`,
              );
              await prisma.pushSubscriptions.delete({ where: { id: sub.id } });
            } else {
              logger.error(
                `Error sending push notification to sub ${sub.id}: `,
                err,
              );
            }
          }),
      );

      await Promise.all(promises);
      logger.info(
        `Scheduled notifications completely dispatched to ${subscriptions.length} clients`,
      );
    } catch (e) {
      logger.error("Error in push scheduler execution: ", e);
    }
  });

  logger.info(
    "Initialized Push Scheduler (Scheduled for Sat & Sun at 11:30 AM)",
  );
}
