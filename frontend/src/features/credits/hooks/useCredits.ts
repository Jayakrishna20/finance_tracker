import { useQuery } from "@tanstack/react-query";
import { CreditsAPI } from "../../../api/credits";
import type { Credit } from "../../../types";

export const useCredits = (params?: { skip?: number; take?: number }) => {
  return useQuery<Credit[], Error>({
    queryKey: ["credits"],
    queryFn: () => CreditsAPI.getAll(params),
  });
};
