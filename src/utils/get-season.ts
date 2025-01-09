import { seasons } from "../constants";
import type { Season } from "../interfaces";

/**
 * Returns the season for a given month.
 * @param month - The month as a number (1 for January, 12 for December).
 * @returns The corresponding season as a string.
 */

export const getSeason = (month: number): Season => {
    if (month < 1 || month > 12) throw new Error('The month must be a number between 1 and 12');

    return seasons[month];
}