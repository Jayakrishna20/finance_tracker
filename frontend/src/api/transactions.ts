import { API_ROUTES } from './routes';
import { axiosClient } from './client';
import type { Transaction, CreateTransactionPayload, UpdateTransactionPayload } from '../types';

export const TransactionsAPI = {
    create: async (payload: CreateTransactionPayload): Promise<Transaction> => {
        const roundedPayload = { ...payload, amount: Math.round(payload.amount) };
        const res = await axiosClient.post(API_ROUTES.TRANSACTIONS.CREATE, roundedPayload);
        return res.data.data;
    },
    getAll: async (params?: { skip?: number; take?: number; categoryTypeName?: string }): Promise<Transaction[]> => {
        const res = await axiosClient.get(API_ROUTES.TRANSACTIONS.GET_ALL, { params });
        return res.data.data;
    },
    update: async (id: string, payload: UpdateTransactionPayload): Promise<Transaction> => {
        const roundedPayload = {
            ...payload,
            amount: payload.amount !== undefined ? Math.round(payload.amount) : undefined
        };
        const res = await axiosClient.patch(API_ROUTES.TRANSACTIONS.UPDATE(id), roundedPayload);
        return res.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(API_ROUTES.TRANSACTIONS.DELETE(id));
    }
};
