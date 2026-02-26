export const API_ROUTES = {
    TRANSACTIONS: {
        GET_ALL: '/api/transactions',
        CREATE: '/api/transactions',
        UPDATE: (id: string) => `/api/transactions/${id}`,
        DELETE: (id: string) => `/api/transactions/${id}`,
    },
    ANALYTICS: {
        GET_SUMMARY: '/api/analytics/summary',
    },
    CATEGORIES: {
        GET_ALL: '/api/categories',
        CREATE: '/api/categories',
    }
} as const;
