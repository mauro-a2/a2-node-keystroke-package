
/**
 * Converts an emoji character to its Unicode code point representation.
 *
 * @param {string} emoji - The emoji character to convert.
 * @param {boolean} [isAndroid=false] - Determines if the emoji should be normalized for Android devices.
 *    - `true`: Normalizes the emoji using NFC (Normalization Form Canonical Composition) before converting.
 *    - `false`: Directly retrieves the Unicode code point without normalization.
 * @returns {string} The Unicode code point of the emoji in uppercase hexadecimal format.
 *
 * @example
 * getEmojiUnicode('😀');
 * // Returns: "1F600"
 *
 * getEmojiUnicode('😀', true);
 * // Returns: "1F600"
 */
export const getEmojiUnicode = (emoji: string, isAndroid: boolean = false): string => {

    if (isAndroid) {
        const normalizedCodePoint = emoji.normalize('NFC').codePointAt(0)!.toString(16).toUpperCase();
        return normalizedCodePoint;
    }

    // Get the code in UTF-32 format
    const utf32CodePoint = emoji.codePointAt(0)!.toString(16).toUpperCase();
    return utf32CodePoint;
}