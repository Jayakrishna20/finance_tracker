import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditsAPI } from "../../../api/credits";
import type { CreateCreditPayload } from "../../../types";

export const useCreateCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCreditPayload) => CreditsAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};
