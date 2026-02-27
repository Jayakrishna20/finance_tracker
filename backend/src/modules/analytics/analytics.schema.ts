import { z } from 'zod';

export const WeeklyAnalyticsQuery = z.object({
    week: z.coerce.number().min(1).max(53),
    year: z.coerce.number().min(2000),
});

export const MonthlyAnalyticsQuery = z.object({
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000),
});

export const YearlyAnalyticsQuery = z.object({
    year: z.coerce.number().min(2000),
});

export type WeeklyQueryInput = z.infer<typeof WeeklyAnalyticsQuery>;
export type MonthlyQueryInput = z.infer<typeof MonthlyAnalyticsQuery>;
export type YearlyQueryInput = z.infer<typeof YearlyAnalyticsQuery>;
