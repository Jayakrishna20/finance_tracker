import { useQuery } from "@tanstack/react-query";
import { ArchiveAPI } from "../../../api/archive";
import { DataSource } from "../../../types";

export const useArchive = (
  periodType: "WEEKLY" | "MONTHLY" | "YEARLY",
  dataSource: DataSource = DataSource.Transactions,
) => {
  return useQuery({
    queryKey: ["archive", periodType, dataSource],
    queryFn: async () => {
      const isCredits = dataSource === DataSource.Credits;
      if (periodType === "WEEKLY") {
        return isCredits
          ? ArchiveAPI.getWeeklyCredits()
          : ArchiveAPI.getWeekly();
      } else if (periodType === "MONTHLY") {
        return isCredits
          ? ArchiveAPI.getMonthlyCredits()
          : ArchiveAPI.getMonthly();
      } else {
        return isCredits
          ? ArchiveAPI.getYearlyCredits()
          : ArchiveAPI.getYearly();
      }
    },
  });
};
