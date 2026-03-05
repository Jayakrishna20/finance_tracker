import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditsAPI } from "../../../api/credits";

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
