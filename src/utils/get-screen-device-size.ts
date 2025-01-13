import type { ScreenSize } from "../interfaces";

/**
 * Calculates the screen size of the device in the specified unit ('px' or 'mm').
 *
 * @param {('px' | 'mm')} unit - The unit of measurement for the screen size.
 *                                'px' returns the dimensions in pixels, 
 *                                while 'mm' returns the dimensions in millimeters (estimated).
 * @returns {ScreenSize} An object containing the width and height of the screen in the selected unit.
 *                       - If 'px', dimensions are returned as integers.
 *                       - If 'mm', dimensions are returned as numbers rounded to two decimal places.
 *
 * @example
 * // Get screen size in pixels
 * const sizeInPixels = getScreenDeviceSize('px');
 * console.log(sizeInPixels); // { width: 1920, height: 1080 }
 *
 * @example
 * // Get screen size in millimeters
 * const sizeInMillimeters = getScreenDeviceSize('mm');
 * console.log(sizeInMillimeters); // { width: 508.02, height: 285.75 }
 *
 * @note The conversion to millimeters is an estimation based on the device's pixel density (DPI).
 *       The accuracy may vary depending on the device and browser.
 */

export const getScreenDeviceSize = (unit: 'px' | 'mm'): ScreenSize => {
    const screenWidthPixels = screen.width;
    const screenHeightPixels = screen.height;

    if (unit === 'px') {
        return {
            width: screenWidthPixels,
            height: screenHeightPixels,
        }
    }

    const dpi = window.devicePixelRatio * 96; // Estimation based on browser pixel rate
    const inchToMm = 25.4; // Conversion from inches to mm

    const screenWidthMm = (screen.width / dpi) * inchToMm;
    const screenHeightMm = (screen.height / dpi) * inchToMm;

    return {
        width: Number(screenWidthMm.toFixed(2)),
        height: Number(screenHeightMm.toFixed(2)),
    }
}