import emojiRegex from 'emoji-regex';

export const checkIsEmoji = (character: string): boolean => {
    const regex = emojiRegex();
    return regex.test(character);
}