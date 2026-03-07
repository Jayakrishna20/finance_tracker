import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditsAPI } from "../../../api/credits";
import type {
  Credit,
  CreateCreditPayload,
  UpdateCreditPayload,
} from "../../../types";

export const useCredits = (params?: { skip?: number; take?: number }) => {
  return useQuery<Credit[], Error>({
    queryKey: ["credits", params],
    queryFn: async () => {
      const result: any = await CreditsAPI.getAll(params);
      return result.data || result;
    },
  });
};

export const useCreateCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCreditPayload) => CreditsAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};

export const useUpdateCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateCreditPayload;
    }) => CreditsAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};

export const useBatchUpdateCredits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      paidStatus,
    }: {
      ids: number[];
      paidStatus: boolean;
    }) => {
      await CreditsAPI.updateStatusBatch(ids, paidStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};

export const useDeleteCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CreditsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};
