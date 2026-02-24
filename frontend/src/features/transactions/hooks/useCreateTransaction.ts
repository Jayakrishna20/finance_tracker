import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionsAPI } from '../../../api/transactions';
import type { Transaction } from '../../../types';

type NewTransactionInput = Omit<Transaction, 'id'>;

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TransactionsAPI.create,
        onMutate: async (newTx: NewTransactionInput) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTxs = queryClient.getQueryData<Transaction[]>(['transactions']);

            if (previousTxs) {
                queryClient.setQueryData<Transaction[]>(['transactions'], [
                    ...previousTxs,
                    { ...newTx, id: `temp-${Date.now()}` } as Transaction
                ]);
            }

            return { previousTxs };
        },
        onError: (_err, _newTx, context) => {
            if (context?.previousTxs) {
                queryClient.setQueryData(['transactions'], context.previousTxs);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};
