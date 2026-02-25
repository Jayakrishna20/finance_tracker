import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../api/client";
import { API_ROUTES } from "../../../api/routes";
import type { Category } from "../../../types";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            // In prod userId would be from auth, using DEMO-USER here
            const response = await axiosClient.get<{ data: Category[] }>(
                `${API_ROUTES.CATEGORIES.GET_ALL}?userId=808240ba-8501-447a-8f64-463ae30e71ce`
            );
            return response.data.data;
        },
    });
};
