import { Type } from '@sinclair/typebox';

export const WeeklyAnalyticsSchema = Type.Object({
    week: Type.Number(),
    year: Type.Number(),
});

export const MonthlyAnalyticsSchema = Type.Object({
    monthYear: Type.String(), // e.g., 'Oct-2026'
});

export const YearlyAnalyticsSchema = Type.Object({
    year: Type.Number(),
});
