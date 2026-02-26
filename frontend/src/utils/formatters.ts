import { APP_CONFIG } from '../config/constants';

/**
 * Formats a numeric value as currency (e.g., $1,234)
 * @param value The number to format
 * @param options Intl.NumberFormatOptions
 * @returns Formatted currency string
 */
export const formatCurrency = (
    value: number | undefined | null,
    options: Intl.NumberFormatOptions = {}
): string => {
    if (value === undefined || value === null) return '';

    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
        style: 'currency',
        currency: APP_CONFIG.CURRENCY,
        maximumFractionDigits: 0,
        ...options,
    }).format(value);
};

/**
 * Formats a date string or object into a standardized display format
 */
export const formatDate = (date: string | Date): string => {
    // Assuming date-fns is available since it's used elsewhere
    // We can just keep it simple or use native if we want to avoid deps
    return new Date(date).toLocaleDateString(APP_CONFIG.LOCALE, {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
};
