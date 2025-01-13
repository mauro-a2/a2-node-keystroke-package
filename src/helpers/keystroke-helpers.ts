import type { IKeystrokeCollection } from "../interfaces";
import {
    getTimeOfDay,
    getDayOfWeek,
    getSeason,
    generateUUID,
} from "../utils";

export const getInitialTypingData = (): IKeystrokeCollection => ({
    // startTimestamp: getFormattedTimestamp(),
    keyArea: [],
    keyTypes: [],
    length: 0,
    pressTimes: [],
    qualityCheck: [],
    releaseTimes: [],
    season: getSeason(new Date().getMonth() + 1),
    sessionID: generateUUID(),
    setting: "ah",
    source: "mech",
    startUnixTime: null,
    study: "demo",
    task: "free",
    textStructure: [],
    time: getTimeOfDay(new Date().getHours()),
    timeZone: new Date().getTimezoneOffset() / -60,
    weekday: getDayOfWeek(new Date()),
})
