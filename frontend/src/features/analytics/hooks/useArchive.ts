import { useQuery } from "@tanstack/react-query";
import { ArchiveAPI } from "../../../api/archive";

export const useArchive = (periodType: "WEEKLY" | "MONTHLY" | "YEARLY") => {
  return useQuery({
    queryKey: ["archive", periodType],
    queryFn: async () => {
      if (periodType === "WEEKLY") {
        return ArchiveAPI.getWeekly();
      } else if (periodType === "MONTHLY") {
        return ArchiveAPI.getMonthly();
      } else {
        return ArchiveAPI.getYearly();
      }
    },
  });
};
