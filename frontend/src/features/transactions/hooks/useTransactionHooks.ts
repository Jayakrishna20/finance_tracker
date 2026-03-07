import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionsAPI } from "../../../api/transactions";
import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
} from "../../../types";
import { useCategoryStore } from "../../../store/useCategoryStore";

export const useTransactions = (params?: { skip?: number; take?: number }) => {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const result: any = await TransactionsAPI.getAll(params);
      return result.data || result;
    },
  });
};

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

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTransactionPayload;
    }) => TransactionsAPI.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTxs = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);

      if (previousTxs) {
        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          (old) =>
            old?.map((tx) =>
              tx.transactionId === id ? { ...tx, ...payload } : tx,
            ) || [],
        );
      }

      return { previousTxs };
    },
    onError: (_err, _variables, context) => {
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

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TransactionsAPI.delete,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      const previousTxs = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);

      if (previousTxs) {
        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          (old) => old?.filter((tx) => tx.transactionId !== id) || [],
        );
      }

      return { previousTxs };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTxs) {
        queryClient.setQueryData(["transactions"], context.previousTxs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
