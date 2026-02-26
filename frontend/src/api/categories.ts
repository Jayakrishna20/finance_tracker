import { API_ROUTES } from './routes';
import { axiosClient } from './client';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types';

export const CategoriesAPI = {
    create: async (payload: CreateCategoryPayload): Promise<Category> => {
        const res = await axiosClient.post(API_ROUTES.CATEGORIES.CREATE, payload);
        return res.data.data;
    },
    getAll: async (): Promise<Category[]> => {
        const res = await axiosClient.get(API_ROUTES.CATEGORIES.GET_ALL);
        return res.data.data;
    },
    update: async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
        const res = await axiosClient.patch(API_ROUTES.CATEGORIES.UPDATE(id), payload);
        return res.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await axiosClient.delete(API_ROUTES.CATEGORIES.DELETE(id));
    }
};
