import { Type } from '@sinclair/typebox';

export const WeeklyAnalyticsSchema = Type.Object({
    userId: Type.String({ format: 'uuid' }),
    week: Type.Integer({ minimum: 1, maximum: 53 }),
    year: Type.Integer({ minimum: 2000, maximum: 2100 })
});

export const MonthlyAnalyticsSchema = Type.Object({
    userId: Type.String({ format: 'uuid' }),
    monthYear: Type.String() // Example: "02-2026"
});

export const YearlyAnalyticsSchema = Type.Object({
    userId: Type.String({ format: 'uuid' }),
    year: Type.Integer({ minimum: 2000, maximum: 2100 })
});
