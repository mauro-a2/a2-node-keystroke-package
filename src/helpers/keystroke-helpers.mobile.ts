import type { IMobileKeystrokeCollection } from "../interfaces";
import {
    formatLanguage,
    generateUUID,
    getDayOfWeek,
    getKeyboardLayout,
    getScreenDeviceSize,
    getSeason,
    getTimeOfDay
} from '../utils';

export const getInitialMobileTypingData = (): IMobileKeystrokeCollection => ({
    autocorrectLengths: [],
    autocorrectTimes: [],
    emojis: [],
    keyArea: [],
    keyTypes: [],
    language: formatLanguage(),
    layout: getKeyboardLayout(),
    pasteLengths: [],
    pasteTimes: [],
    performance: [],
    predictionLengths: [],
    predictionTimes: [],
    pressTimes: [],
    releaseTimes: [],
    screenSizeMm: getScreenDeviceSize('mm'),
    screenSizePx: getScreenDeviceSize('px'),
    season: getSeason(new Date().getMonth() + 1),
    sessionID: generateUUID(),
    startUnixTime: null,
    textField: "Text_ACOFF",
    time: getTimeOfDay(new Date().getHours()),
    timeZone: new Date().getTimezoneOffset() / -60,
    weekday: getDayOfWeek(new Date())
})