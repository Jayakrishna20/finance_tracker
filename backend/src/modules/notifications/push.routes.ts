import { FastifyInstance } from "fastify";
import { z } from "zod";
import webpush from "web-push";
import { env } from "../../config/env.js";

webpush.setVapidDetails(
  "mailto:" + env.EMAIL_TO,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY,
);

export default async function pushRoutes(app: FastifyInstance) {
  // Save subscription
  app.post("/subscribe", {
    schema: {
      tags: ["Push Notifications"],
      summary: "Subscribe to push notifications",
      body: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    },
    handler: async (request, reply) => {
      const subscription = request.body as any;

      // Upsert subscription
      await app.prisma.pushSubscriptions.upsert({
        where: { endpoint: subscription.endpoint },
        update: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        create: {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      });

      return reply
        .code(201)
        .send({ success: true, message: "Subscribed successfully" });
    },
  });

  // Test push
  app.post("/test-push", {
    schema: {
      tags: ["Push Notifications"],
      summary: "Test sending a push notification",
      body: z.object({
        title: z.string(),
        body: z.string(),
      }),
    },
    handler: async (request, reply) => {
      const { title, body } = request.body as any;
      const subscriptions = await app.prisma.pushSubscriptions.findMany();

      const payload = JSON.stringify({
        title,
        body,
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
          .catch((err: any) => {
            if (err.statusCode === 404 || err.statusCode === 410) {
              return app.prisma.pushSubscriptions.delete({
                where: { id: sub.id },
              });
            }
          }),
      );

      await Promise.all(promises);
      return reply.send({ success: true, message: "Push notification sent" });
    },
  });
}
