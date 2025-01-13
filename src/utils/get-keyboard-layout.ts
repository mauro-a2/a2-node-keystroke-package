import { defaultCountriesAndLayoutByLanguage } from "../constants";

export const getKeyboardLayout = (): string => {
    const userLanguageCode = navigator.language.split('-')[0];
    return defaultCountriesAndLayoutByLanguage[userLanguageCode]?.keyboardLayout || 'QWERTY';
}