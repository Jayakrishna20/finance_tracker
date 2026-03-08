export const API_ROUTES = {
  TRANSACTIONS: {
    GET_ALL: "/transactions",
    CREATE: "/transactions",
    UPDATE: (id: number) => `/transactions/${id}`,
    DELETE: (id: number) => `/transactions/${id}`,
  },
  ANALYTICS: {
    WEEKLY: "/analytics/weekly",
    MONTHLY: "/analytics/monthly",
    YEARLY: "/analytics/yearly",
    CREDITS_WEEKLY: "/analytics/credits/weekly",
    CREDITS_MONTHLY: "/analytics/credits/monthly",
    CREDITS_YEARLY: "/analytics/credits/yearly",
  },
  ARCHIVE: {
    WEEKLY: "/archive/weekly",
    MONTHLY: "/archive/monthly",
    YEARLY: "/archive/yearly",
    CREDITS_WEEKLY: "/archive/credits/weekly",
    CREDITS_MONTHLY: "/archive/credits/monthly",
    CREDITS_YEARLY: "/archive/credits/yearly",
  },
  CATEGORIES: {
    GET_ALL: "/categories",
    GET_BY_ID: (id: number) => `/categories/${id}`,
    GET_BY_TYPE: (typeId: number) => `/categories/type/${typeId}`,
    CREATE: "/categories",
    UPDATE: (id: number) => `/categories/${id}`,
    DELETE: (id: number) => `/categories/${id}`,
  },
  CREDITS: {
    GET_ALL: "/credits",
    CREATE: "/credits",
    UPDATE: (id: number) => `/credits/${id}`,
    DELETE: (id: number) => `/credits/${id}`,
    UPDATE_STATUS_BATCH: (paidStatus: boolean) =>
      `/credits/status/${paidStatus}`,
  },
} as const;
