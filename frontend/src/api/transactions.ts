import type {
  CreateTransactionPayload,
  Transaction,
  UpdateTransactionPayload,
} from "../types";
import { axiosClient } from "./client";
import { API_ROUTES } from "./routes";

export const TransactionsAPI = {
  create: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    const roundedPayload = { ...payload, amount: Math.round(payload.amount) };
    const res = await axiosClient.post(
      API_ROUTES.TRANSACTIONS.CREATE,
      roundedPayload,
    );
    return res.data.data;
  },
  getAll: async (params?: {
    skip?: number;
    take?: number;
    categoryTypeId?: number;
  }): Promise<Transaction[]> => {
    const res = await axiosClient.get(API_ROUTES.TRANSACTIONS.GET_ALL, {
      params,
    });
    return res.data.data;
  },
  update: async (
    id: number,
    payload: UpdateTransactionPayload,
  ): Promise<Transaction> => {
    const roundedPayload = {
      ...payload,
      amount:
        payload.amount !== undefined ? Math.round(payload.amount) : undefined,
    };
    const res = await axiosClient.put(
      API_ROUTES.TRANSACTIONS.UPDATE(id),
      roundedPayload,
    );
    return res.data.data;
  },
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(API_ROUTES.TRANSACTIONS.DELETE(id));
  },
};
