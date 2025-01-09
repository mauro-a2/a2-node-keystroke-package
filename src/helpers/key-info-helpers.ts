import { keyTypes, keyZones, specialKeyMap, specialKeys } from "../constants";
import { checkIsEmoji } from '../utils';

export const getKeyCode = (character: string): number => {
    if (checkIsEmoji(character)) { return 900 } //* Special code for emojis

    if (character.length === 1) {
        return character.charCodeAt(0);
    }

    return specialKeyMap[character] || 0;  //* Default to 0 if no match is found
}

export const getKeyArea = (character: string): number => {
    //? Determine the key zone for the given character
    for (const [zone, regex] of Object.entries(keyZones)) {
        if (regex.test(character)) {
            return parseInt(zone);
        }
    }

    //? Check if the character matches a special key
    if (specialKeys.Backspace.test(character) ||
        specialKeys.Meta.test(character) ||
        specialKeys.Enter.test(character) ||
        specialKeys.Space.test(character)) {
        return 0;
    }

    return 0; //* Default to 0 if no match is found
}

export const getKeyType = (character: string): string => {
    for (const [type, regex] of Object.entries(keyTypes)) {
        if (regex.test(character)) {
            switch (type) {
                case 'alphanumeric': return 'an';
                case 'punctuation': return 'pt';
                case 'modifierKeys': return 'md';
                case 'space': return 'sp';
                case 'backspace': return 'bk';
                case 'emoji': return 'em';
                case 'enterKey': return 'en';
            }
        }
    }

    return 'ukn';  //* Returns 'ukn' if the type is not found
}