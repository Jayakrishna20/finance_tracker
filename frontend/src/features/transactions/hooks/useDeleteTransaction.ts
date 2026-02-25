import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionsAPI } from '../../../api/transactions';
import toast from 'react-hot-toast';
import type { Transaction } from '../../../types';

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TransactionsAPI.delete,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTxs = queryClient.getQueryData<Transaction[]>(['transactions']);

            if (previousTxs) {
                queryClient.setQueryData<Transaction[]>(['transactions'], (old) =>
                    old?.filter((tx) => tx.id !== id) || []
                );
            }

            return { previousTxs };
        },
        onError: (_err, _id, context) => {
            if (context?.previousTxs) {
                queryClient.setQueryData(['transactions'], context.previousTxs);
            }
            toast.error("Failed to delete transaction.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onSuccess: () => {
            toast.success("Transaction deleted!");
        }
    });
};
