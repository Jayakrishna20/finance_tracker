import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionsAPI } from '../../../api/transactions';
import toast from 'react-hot-toast';
import type { Transaction, UpdateTransactionPayload } from '../../../types';

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateTransactionPayload }) =>
            TransactionsAPI.update(id, payload),
        onMutate: async ({ id, payload }) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTxs = queryClient.getQueryData<Transaction[]>(['transactions']);

            if (previousTxs) {
                queryClient.setQueryData<Transaction[]>(['transactions'], (old) =>
                    old?.map((tx) => (tx.id === id ? { ...tx, ...payload } : tx)) || []
                );
            }

            return { previousTxs };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousTxs) {
                queryClient.setQueryData(['transactions'], context.previousTxs);
            }
            toast.error("Failed to update transaction.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onSuccess: () => {
            toast.success("Transaction updated successfully!");
        }
    });
};
