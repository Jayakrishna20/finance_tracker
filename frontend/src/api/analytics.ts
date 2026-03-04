import { API_ROUTES } from "./routes";
import { axiosClient } from "./client";

export interface AnalyticsQuery {
  week?: number;
  month?: number;
  year: number;
}

export const AnalyticsAPI = {
  getWeekly: async (params: { week: number; year: number }) => {
    const res = await axiosClient.get(API_ROUTES.ANALYTICS.WEEKLY, { params });
    return res.data.data;
  },
  getMonthly: async (params: { month: number; year: number }) => {
    const res = await axiosClient.get(API_ROUTES.ANALYTICS.MONTHLY, { params });
    return res.data.data;
  },
  getYearly: async (params: { year: number }) => {
    const res = await axiosClient.get(API_ROUTES.ANALYTICS.YEARLY, { params });
    return res.data.data;
  },
};
