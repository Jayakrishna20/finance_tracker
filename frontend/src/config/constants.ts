export const APP_CONFIG = {
    CURRENCY: 'INR',
    LOCALE: 'en-IN',
};

export const COLORS = {
    PRIMARY: '#B9FF66',
    SECONDARY: '#191A23',
    ACCENT: '#A3E65A',
    DARK_GRAY: '#292A32',
    LIGHT_GRAY: '#F3F3F3',
    MUTED: '#CCCCCC',
    ERROR: '#EF4444',
    SUCCESS: '#10B981',
};

export const CHART_COLORS = [
    "#B9FF66",
    "#191A23",
    "#A3E65A",
    "#292A32",
    "#F3F3F3",
    "#CCCCCC",
];

export const PERIOD_TYPES = {
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY',
} as const;

export type PeriodType = keyof typeof PERIOD_TYPES;
