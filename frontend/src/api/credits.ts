import type {
  Credit,
  CreateCreditPayload,
  UpdateCreditPayload,
} from "../types";
import { axiosClient } from "./client";
import { API_ROUTES } from "./routes";

export const CreditsAPI = {
  create: async (payload: CreateCreditPayload): Promise<Credit> => {
    const res = await axiosClient.post(API_ROUTES.CREDITS.CREATE, payload);
    return res.data.data;
  },
  getAll: async (): Promise<Credit[]> => {
    const res = await axiosClient.get(API_ROUTES.CREDITS.GET_ALL);
    return res.data.data;
  },
  update: async (id: number, payload: UpdateCreditPayload): Promise<Credit> => {
    const res = await axiosClient.put(API_ROUTES.CREDITS.UPDATE(id), payload);
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(API_ROUTES.CREDITS.DELETE(id));
  },
};
