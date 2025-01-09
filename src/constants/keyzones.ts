import emojiRegex from "emoji-regex";

export const keyZones: { [key: string]: RegExp } = {
    1: /[12qwaszx]/i,
    2: /[34erdfcv]/i,
    3: /[56tyghbn]/i,
    4: /[78uijkm,]/i,
    5: /[90opl;./]/i,
    6: /[-=']/i
};

export const specialKeys = {
    Backspace: /Backspace/i,
    Meta: /(Shift|Alt|Control|CapsLock)/i,
    Enter: /Enter/i,
    Space: / /i
};

export const keyTypes: { [key: string]: RegExp } = {
    alphanumeric: /^[a-z0-9]$/i,
    punctuation: /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/,
    modifierKeys: /^(Shift|Alt|Control|CapsLock|Meta|ContextMenu|NumLock|ScrollLock)$/i,
    space: / /,
    backspace: /Backspace/i,
    emoji: emojiRegex(),  //* Regex for emojis
    enterKey: /Enter/i  //* Regex to match "Enter" key
};