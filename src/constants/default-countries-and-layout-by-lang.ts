
export const defaultCountriesAndLayoutByLanguage: {
    [key: string]: {
        country: string;
        keyboardLayout: string
    }
} = {
    en: { country: "US", keyboardLayout: "QWERTY" },  // Inglés - Estados Unidos
    zh: { country: "CN", keyboardLayout: "QWERTY" }, // Chino simplificado - China
    es: { country: "ES", keyboardLayout: "QWERTY (Spanish)" }, // Español - España
    fr: { country: "FR", keyboardLayout: "AZERTY" },  // Francés - Francia
    ar: { country: "SA", keyboardLayout: "Arabic (Standard)" }, // Árabe - Arabia Saudita
    pt: { country: "PT", keyboardLayout: "QWERTY (Portuguese)" }, // Portugués - Portugal
    ru: { country: "RU", keyboardLayout: "ЙЦУКЕН" }, // Ruso - Rusia
    ja: { country: "JP", keyboardLayout: "QWERTY (JIS)" }, // Japonés - Japón
    de: { country: "DE", keyboardLayout: "QWERTZ" },  // Alemán - Alemania
    it: { country: "IT", keyboardLayout: "QWERTY (Italian)" }, // Italiano - Italia
}