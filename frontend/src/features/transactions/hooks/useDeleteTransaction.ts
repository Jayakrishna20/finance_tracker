import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionsAPI } from '../../../api/transactions';
import type { Transaction } from '../../../types';

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TransactionsAPI.delete,
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTxs = queryClient.getQueryData<Transaction[]>(['transactions']);

            if (previousTxs) {
                queryClient.setQueryData<Transaction[]>(['transactions'], (old) =>
                    old?.filter((tx) => tx.transactionId !== id) || []
                );
            }

            return { previousTxs };
        },
        onError: (_err, _id, context) => {
            if (context?.previousTxs) {
                queryClient.setQueryData(['transactions'], context.previousTxs);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    });
};
