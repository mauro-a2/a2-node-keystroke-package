import type { DayOfWeek } from "../interfaces";


/**
 * Returns the day of the week as a string based on a given date.
 * @param date - The date object to get the day of the week from.
 * @returns The corresponding day of the week as a string.
 */

export const getDayOfWeek = (date: Date): DayOfWeek => {
    const daysOfWeek: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
};