import { useQuery } from '@tanstack/react-query';
import { TransactionsAPI } from '../../../api/transactions';
import type { Transaction } from '../../../types';

export const useTransactions = (params?: { skip?: number; take?: number; categoryTypeName?: string }) => {
    return useQuery<Transaction[], Error>({
        queryKey: ['transactions', params],
        queryFn: () => TransactionsAPI.getAll(params),
    });
};
