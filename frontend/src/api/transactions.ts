import { API_ROUTES } from './routes';
import { axiosClient } from './client';
import type { Transaction } from '../types';

export const TransactionsAPI = {
    // Create with rounding amount requirement constraint
    create: async (payload: Omit<Transaction, 'id'>) => {
        const roundedPayload = { ...payload, amount: Math.round(payload.amount) };
        const res = await axiosClient.post(API_ROUTES.TRANSACTIONS.CREATE, roundedPayload);
        return res.data;
    },
    getAll: async () => {
        const res = await axiosClient.get(API_ROUTES.TRANSACTIONS.GET_ALL);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await axiosClient.delete(API_ROUTES.TRANSACTIONS.DELETE(id));
        return res.data;
    }
};
