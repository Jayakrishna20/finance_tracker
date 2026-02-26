import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionsAPI } from '../../../api/transactions';
import toast from 'react-hot-toast';
import type { Transaction, CreateTransactionPayload } from '../../../types';

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TransactionsAPI.create,
        onMutate: async (newTx: CreateTransactionPayload) => {
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
            toast.error("Failed to add transaction.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onSuccess: () => {
            toast.success("Transaction added successfully!");
        }
    });
};
