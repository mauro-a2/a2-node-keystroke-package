
/**
 * Compares two strings and returns the words present in the first string but not in the second.
 * The comparison is case-insensitive and ignores leading/trailing spaces.
 *
 * @param {string} string1 - The first string to compare.
 * @param {string} string2 - The second string to compare against.
 * @returns {string} - A single string containing the words from `string1` that are not found in `string2`, separated by spaces.
 *
 * @example
 * const string1 = "Hello world from TypeScript";
 * const string2 = "Hello from JavaScript";
 * const result = getDifferenceBetweenWords(string1, string2);
 * console.log(result); // Output: "world TypeScript"
 */


export const getDifferenceBetweenWords = (string1: string, string2: string): string => {
    //? Splits both strings into words and removes extra spaces
    const words1 = string1.toLowerCase().trim().split(/\s+/);
    const words2 = string2.toLowerCase().trim().split(/\s+/);

    //? Filters out words in string1 that are not in string2
    const differences = words1.filter(word => !words2.includes(word));

    return differences.join(' ');
}