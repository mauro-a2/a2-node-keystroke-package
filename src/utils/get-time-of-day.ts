import type { TimeOfDay } from "../interfaces";

/**
 * Returns the time of day based on the hour.
 * @param hour - The hour as a number (0-23).
 * @returns The corresponding time of day as a string.
 */

export const getTimeOfDay = (hour: number): TimeOfDay => {
    if (hour < 0 || hour >= 24) throw new Error('The time must be a number between 0 and 23');

    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    if (hour >= 18 && hour <= 23) return 'Evening';
    return 'Night';
}