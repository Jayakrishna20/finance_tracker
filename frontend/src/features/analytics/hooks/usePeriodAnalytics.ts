import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PeriodType } from "../../../config/constants";
import { parse, getYear } from "date-fns";
import { AnalyticsAPI } from "../../../api/analytics";
import { DataSource } from "../../../types";

export const usePeriodAnalytics = (
  periodType: PeriodType,
  periodValue: string,
  yearValue?: number,
  dataSource: DataSource = DataSource.Transactions,
) => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", periodType, periodValue, yearValue, dataSource],
    queryFn: async () => {
      const now = new Date();
      const isCredits = dataSource === DataSource.Credits;
      if (periodType === "WEEKLY") {
        const params = {
          week: parseInt(periodValue),
          year: yearValue || getYear(now),
        };
        return isCredits
          ? AnalyticsAPI.getWeeklyCredits(params)
          : AnalyticsAPI.getWeekly(params);
      } else if (periodType === "MONTHLY") {
        const date = parse(periodValue, "MMM-yyyy", now);
        const params = { month: date.getMonth() + 1, year: date.getFullYear() };
        return isCredits
          ? AnalyticsAPI.getMonthlyCredits(params)
          : AnalyticsAPI.getMonthly(params);
      } else {
        const params = { year: parseInt(periodValue) };
        return isCredits
          ? AnalyticsAPI.getYearlyCredits(params)
          : AnalyticsAPI.getYearly(params);
      }
    },
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
