import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { PeriodType } from '../../../config/constants';
import { parse, getYear } from 'date-fns';
import { AnalyticsAPI } from '../../../api/analytics';

export const usePeriodAnalytics = (periodType: PeriodType, periodValue: string, yearValue?: number) => {
    const { data: analyticsData, isLoading } = useQuery({
        queryKey: ['analytics', periodType, periodValue, yearValue],
        queryFn: async () => {
            const now = new Date();
            if (periodType === 'WEEKLY') {
                return AnalyticsAPI.getWeekly({
                    week: parseInt(periodValue),
                    year: yearValue || getYear(now)
                });
            } else if (periodType === 'MONTHLY') {
                const date = parse(periodValue, "MMM-yyyy", now);
                return AnalyticsAPI.getMonthly({
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                });
            } else {
                return AnalyticsAPI.getYearly({
                    year: parseInt(periodValue)
                });
            }
        }
    });

    const aggregatedData = useMemo(() => {
        if (!analyticsData) return { chartData: [], gridData: [], total: 0 };

        const { categories, grandTotal } = analyticsData;

        const chartData = categories.map((c: any) => ({
            name: c.categoryName,
            value: c.total,
        }));

        const gridData = categories.map((c: any, i: number) => ({
            id: i,
            category: c.categoryName,
            amount: c.total,
        }));

        return { chartData, gridData, total: grandTotal };
    }, [analyticsData]);

    return { ...aggregatedData, isLoading };
};
