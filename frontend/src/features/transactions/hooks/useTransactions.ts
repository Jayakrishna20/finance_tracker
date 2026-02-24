import { useQuery } from '@tanstack/react-query';
import { TransactionsAPI } from '../../../api/transactions';
import type { Transaction } from '../../../types';

export const useTransactions = () => {
    return useQuery<Transaction[], Error>({
        queryKey: ['transactions'],
        queryFn: TransactionsAPI.getAll,
    });
};
