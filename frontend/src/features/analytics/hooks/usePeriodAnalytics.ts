import { useMemo } from 'react';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import type { Transaction } from '../../../types';
import type { PeriodType } from '../../../config/constants';
import { getISOWeek, format } from 'date-fns';
import { useCategoryStore } from '../../../store/useCategoryStore';

export const usePeriodAnalytics = (periodType: PeriodType, periodValue: string) => {
    const { data: transactions, isLoading } = useTransactions();
    const { categories } = useCategoryStore();

    const aggregatedData = useMemo(() => {
        if (!transactions) return { chartData: [], gridData: [], total: 0 };

        let filtered: Transaction[] = [];
        if (periodType === 'WEEKLY') {
            filtered = transactions.filter(t => (t.weekNumber || getISOWeek(new Date(t.date))).toString() === periodValue);
        } else if (periodType === 'MONTHLY') {
            filtered = transactions.filter(t => (t.monthYear || format(new Date(t.date), "MMM-yyyy")) === periodValue);
        } else {
            filtered = transactions.filter(t => t.date.startsWith(periodValue));
        }

        const categoryTotals: Record<string, number> = {};
        let grandTotal = 0;

        filtered.forEach(t => {
            const catName = t.category?.name || categories.find(c => c.id === t.categoryId)?.name || 'Unknown';
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
    }, [transactions, periodType, periodValue, categories]);

    return { ...aggregatedData, isLoading };
};
