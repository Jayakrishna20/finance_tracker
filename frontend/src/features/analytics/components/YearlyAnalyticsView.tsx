import React from "react";
import { PeriodAnalytics } from "./PeriodAnalytics";
import { format } from "date-fns";
import { useTransactions } from "../../transactions/hooks/useTransactions";

export const YearlyAnalyticsView: React.FC = () => {
  const currentYear = format(new Date(), "yyyy");
  const { data: transactions } = useTransactions();

  const availableYears = React.useMemo(() => {
    if (!transactions) return [currentYear];
    const years = Array.from(
      new Set(transactions.map((t) => format(new Date(t.date), "yyyy"))),
    ).sort((a, b) => parseInt(b) - parseInt(a));
    return years.includes(currentYear) ? years : [currentYear, ...years];
  }, [transactions, currentYear]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-main to-primary-dark bg-clip-text text-transparent">
        Yearly Spending
      </h2>
      <p className="text-gray-500 max-w-2xl">
        Monitor your yearly spending habits. The pie chart displays your
        categorical breakdown, while the grid provides exact totals.
      </p>

      <div className="mt-8 border-t border-gray-100 pt-8">
        <PeriodAnalytics
          periodType="YEARLY"
          defaultPeriod={currentYear}
          availablePeriods={availableYears}
        />
      </div>
    </div>
  );
};
