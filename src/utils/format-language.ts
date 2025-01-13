import { defaultCountriesAndLayoutByLanguage } from '../constants';

/**
 * Formats the user's language and country code based on the browser's language settings.
 *
 * @returns {string} A formatted language code in the form of `language-country` (e.g., `en-US`).
 * 
 * ### Functionality:
 * - Retrieves the user's browser language using `navigator.language`.
 * - Splits the language string into a language code (e.g., `en`) and a country code (e.g., `US`).
 * - Checks if the country code is valid (i.e., not numeric):
 *   - If valid, returns the original `language-country` format.
 *   - If invalid or missing, assigns a default country code based on the language.
 * - Returns the final formatted language string.
 */

export const formatLanguage = (): string => {
    const lang = navigator.language.split('-');
    const userLanguageCode = lang[0];
    let userCountryCode = lang[1];

    const countryCodeToNumber = Number(userCountryCode)

    if (userCountryCode && isNaN(countryCodeToNumber)) {
        return lang.join('-');
    }

    userCountryCode = defaultCountriesAndLayoutByLanguage[userLanguageCode]?.country || 'not-found';

    if (userCountryCode === 'not-found') { return 'en-US' }

    return `${userLanguageCode}-${userCountryCode}`;
}