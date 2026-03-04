import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditsAPI } from "../../../api/credits";

export const useDeleteCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CreditsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
  });
};
