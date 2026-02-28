export const API_ROUTES = {
    TRANSACTIONS: {
        GET_ALL: '/transactions',
        CREATE: '/transactions',
        UPDATE: (id: string) => `/transactions/${id}`,
        DELETE: (id: string) => `/transactions/${id}`,
    },
    ANALYTICS: {
        GET_SUMMARY: '/analytics/summary',
    },
    CATEGORIES: {
        GET_ALL: '/categories',
        CREATE: '/categories',
        UPDATE: (id: string) => `/categories/${id}`,
        DELETE: (id: string) => `/categories/${id}`,
    }
} as const;
