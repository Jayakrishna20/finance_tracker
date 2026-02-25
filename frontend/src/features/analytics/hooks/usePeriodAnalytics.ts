import { useMemo } from 'react';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import type { Transaction } from '../../../types';

export const usePeriodAnalytics = (periodType: 'WEEKLY' | 'MONTHLY' | 'YEARLY', periodValue: string) => {
    const { data: transactions, isLoading } = useTransactions();

    const aggregatedData = useMemo(() => {
        if (!transactions) return { chartData: [], gridData: [], total: 0 };

        // Filter transactions by the selected period
        // Assumes periodValue formats align: W41-2023, Oct-2023, 2023
        let filtered: Transaction[] = [];
        if (periodType === 'WEEKLY') {
            // Very naive string matching for mock purposes
            filtered = transactions.filter(t => t.weekNumber.toString() === periodValue);
        } else if (periodType === 'MONTHLY') {
            filtered = transactions.filter(t => t.monthYear === periodValue);
        } else {
            filtered = transactions.filter(t => t.date.startsWith(periodValue)); // year matching
        }

        const categoryTotals: Record<string, number> = {};
        let grandTotal = 0;

        filtered.forEach(t => {
            const catName = t.category?.name || 'Unknown';
            categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
            grandTotal += t.amount;
        });

        const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value,
        }));

        const gridData = Object.entries(categoryTotals).map(([category, amount], i) => ({
            id: i,
            category,
            amount,
        }));

        return { chartData, gridData, total: grandTotal };
    }, [transactions, periodType, periodValue]);

    return { ...aggregatedData, isLoading };
};
