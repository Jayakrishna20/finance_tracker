import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../api/client";
import { API_ROUTES } from "../../../api/routes";
import type { Category } from "../../../types";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await axiosClient.get<{ data: Category[] }>(
                API_ROUTES.CATEGORIES.GET_ALL
            );
            return response.data.data;
        },
    });
};
