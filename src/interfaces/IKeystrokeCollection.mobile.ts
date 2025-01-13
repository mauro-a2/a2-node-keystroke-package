import type { IBaseKeystrokeCollection } from "./IKeystrokeCollection";

/**
 * Fields for mobile browsers
 */

export interface IMobileKeystrokeCollection extends IBaseKeystrokeCollection{
    autocorrectLengths: number[];
    autocorrectTimes:   number[];
    emojis:             string[];
    keyboardArea?:      KeyboardArea;
    language:           string;
    layout:             string;
    pasteLengths:       number[];
    pasteTimes:         number[];
    performance:        number[];
    predictionLengths:  number[];
    predictionTimes:    number[];
    screenSizeMm:       ScreenSize;
    screenSizePx:       ScreenSize;
    textField:          TextFieldTypes;
}

export interface ScreenSize {
    width:  number;
    height: number;
}

export interface KeyboardArea extends ScreenSize {
    x: number;
    y: number;
}

export type TextFieldTypes = 'Text' | 'Url' | 'Email' | 'Numbers' | 'Twitter' | 'Websearch' | 'Text_ACOFF' | 'Twitter_ACOFF';