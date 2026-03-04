export const API_ROUTES = {
    TRANSACTIONS: {
        GET_ALL: '/transactions',
        CREATE: '/transactions',
        UPDATE: (id: number) => `/transactions/${id}`,
        DELETE: (id: number) => `/transactions/${id}`,
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
        GET_BY_ID: (id: number) => `/categories/${id}`,
        CREATE: '/categories',
        UPDATE: (id: number) => `/categories/${id}`,
        DELETE: (id: number) => `/categories/${id}`,
    },
    CREDITS: {
        GET_ALL: '/credits',
        CREATE: '/credits',
        UPDATE: (id: number) => `/credits/${id}`,
        DELETE: (id: number) => `/credits/${id}`,
    }
} as const;
