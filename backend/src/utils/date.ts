// Need to map require strictly
import { getISOWeek } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';

/**
 * Normalizes an ISO 8601 Date String to its component grouping dimensions.
 * For true precision in a multi-tenant environment, the timezone should ideally
 * be derived from the requesting User Setting. We default to UTC for foundational processing.
 */
export function getDateDimensions(isoString: string, userTimezone: string = 'UTC') {
    const dateObj = new Date(isoString);
    // Ensure we shift to the user's explicit timezone before doing structural formatting
    // so week boundaries correctly align for their region.
    const zonedDate = toZonedTime(dateObj, userTimezone);

    return {
        date: dateObj, // Keep original native Date for raw DB insertion
        dayName: format(zonedDate, 'EEEE', { timeZone: userTimezone }),
        weekNumber: getISOWeek(zonedDate), // Exact ISO Week mapping
        monthYear: format(zonedDate, 'MM-yyyy', { timeZone: userTimezone }),
        year: parseInt(format(zonedDate, 'yyyy', { timeZone: userTimezone }), 10)
    };
}
