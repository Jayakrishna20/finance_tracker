import { z } from "zod";

export const CreateCreditSchema = z.object({
  description: z.string().min(1).max(255),
  categoryId: z.coerce.bigint(),
  billedDate: z.coerce.date(),
  lastPaymentDate: z.coerce.date(),
  paidStatus: z.boolean(),
  paymentDate: z.coerce.date(),
  amount: z.coerce.bigint(),
});

export const UpdateCreditSchema = CreateCreditSchema.partial();

export const CreditParamsSchema = z.object({
  id: z.coerce.bigint({ message: "Invalid credit ID" }),
});

export const UpdateCreditStatusParamsSchema = z.object({
  paidStatus: z
    .enum(["true", "false", "1", "0"])
    .transform((val) => val === "true" || val === "1"),
});

export const UpdateCreditStatusBodySchema = z.object({
  ids: z.array(z.coerce.bigint()),
});

export const CreditQuerySchema = z.object({
  skip: z.coerce.number().min(0).default(0),
  take: z.coerce.number().min(1).max(100).default(10),
});

export type CreateCreditInput = z.infer<typeof CreateCreditSchema>;
export type UpdateCreditInput = z.infer<typeof UpdateCreditSchema>;
export type CreditQueryInput = z.infer<typeof CreditQuerySchema>;
export type UpdateCreditStatusParamsInput = z.infer<
  typeof UpdateCreditStatusParamsSchema
>;
export type UpdateCreditStatusBodyInput = z.infer<
  typeof UpdateCreditStatusBodySchema
>;
