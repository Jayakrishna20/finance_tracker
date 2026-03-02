import { API_ROUTES } from './routes';
import { axiosClient } from './client';

export const CategoryTypesAPI = {
    getAll: async () => {
        const res = await axiosClient.get(API_ROUTES.CATEGORY_TYPES.GET_ALL);
        return res.data.data;
    },
};
