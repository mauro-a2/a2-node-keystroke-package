import type { KeyboardArea } from '../interfaces/IKeystrokeCollection.mobile';

/**
 * Calculates the area occupied by the on-screen keyboard on mobile devices.
 *
 * This function determines the dimensions of the keyboard area based on the 
 * difference between the total screen height and the current viewport height.
 * If the difference is below a certain threshold, it assumes that the keyboard
 * is not visible.
 *
 * @returns {KeyboardArea | undefined} - An object representing the keyboard's position and dimensions:
 * - `x`: The x-coordinate of the keyboard's starting position (always `0` for full-width keyboards).
 * - `y`: The y-coordinate of the top edge of the keyboard, which matches the viewport's bottom edge.
 * - `width`: The width of the keyboard (matches the viewport's width).
 * - `height`: The height of the keyboard.
 * 
 * Returns `undefined` if the keyboard is not visible or if the function is called outside a browser environment.
 *
 * @example
 * const keyboardArea = getKeyboardArea();
 * if (keyboardArea) {
 *   console.log(`Keyboard height: ${keyboardArea.height}`);
 * }
 */


export const getKeyboardArea = (): KeyboardArea | undefined => {

    const viewportHeight = window.innerHeight;
    const fullHeight = window.screen.height; // Total screen height

    //? If the difference between the height of the window and the screen is significant, there is a visible keyboard.
    const keyboardHeight = fullHeight - viewportHeight;

    if (keyboardHeight <= 100) { return } // Arbitrary threshold for considering the keypad to be active

    return {
        x: 0,
        y: viewportHeight,
        width: window.innerWidth,
        height: keyboardHeight,
    }
}