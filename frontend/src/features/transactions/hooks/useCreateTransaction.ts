import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionsAPI } from "../../../api/transactions";
import type { Transaction, CreateTransactionPayload } from "../../../types";
import { useCategoryStore } from "../../../store/useCategoryStore";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  return useMutation({
    mutationFn: TransactionsAPI.create,
    onMutate: async (newTx: CreateTransactionPayload) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTxs = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);

      if (previousTxs) {
        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          [
            ...previousTxs,
            { ...newTx, transactionId: 0 } as unknown as Transaction,
          ],
        );
      }

      return { previousTxs };
    },
    onError: (_err, _newTx, context) => {
      if (context?.previousTxs) {
        queryClient.setQueryData(["transactions"], context.previousTxs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onSuccess: () => {
      fetchCategories();
    },
  });
};
