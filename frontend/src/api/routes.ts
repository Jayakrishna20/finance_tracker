export const API_ROUTES = {
    TRANSACTIONS: {
        GET_ALL: '/transactions',
        CREATE: '/transactions',
        UPDATE: (id: string) => `/transactions/${id}`,
        DELETE: (id: string) => `/transactions/${id}`,
    },
    ANALYTICS: {
        WEEKLY: '/analytics/weekly',
        MONTHLY: '/analytics/monthly',
        YEARLY: '/analytics/yearly',
    },
    ARCHIVE: {
        WEEKLY: '/archive/weekly',
        MONTHLY: '/archive/monthly',
        YEARLY: '/archive/yearly',
    },
    CATEGORY_TYPES: {
        GET_ALL: '/category-types',
    },
    CATEGORIES: {
        GET_ALL: '/categories',
        GET_BY_ID: (id: string) => `/categories/${id}`,
        CREATE: '/categories',
        UPDATE: (id: string) => `/categories/${id}`,
        DELETE: (id: string) => `/categories/${id}`,
    }
} as const;
