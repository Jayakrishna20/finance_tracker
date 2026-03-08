import { API_ROUTES } from "./routes";
import { axiosClient } from "./client";

export const ArchiveAPI = {
  getWeekly: async () => {
    const res = await axiosClient.get(API_ROUTES.ARCHIVE.WEEKLY);
    return res.data.data;
  },
  getMonthly: async () => {
    const res = await axiosClient.get(API_ROUTES.ARCHIVE.MONTHLY);
    return res.data.data;
  },
  getYearly: async () => {
    const res = await axiosClient.get(API_ROUTES.ARCHIVE.YEARLY);
    return res.data.data;
  },
  getWeeklyCredits: async () => {
    const res = await axiosClient.get(API_ROUTES.ARCHIVE.CREDITS_WEEKLY);
    return res.data.data;
  },
  getMonthlyCredits: async () => {
    const res = await axiosClient.get(API_ROUTES.ARCHIVE.CREDITS_MONTHLY);
    return res.data.data;
  },
  getYearlyCredits: async () => {
    const res = await axiosClient.get(API_ROUTES.ARCHIVE.CREDITS_YEARLY);
    return res.data.data;
  },
};
