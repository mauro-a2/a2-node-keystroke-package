export interface IBaseKeystrokeCollection {
    appContext?:        string;
    keyArea:            number[];
    keyCode:            number[];
    keyTypes:           string[];
    pressTimes:         number[];
    releaseTimes:       number[];
    season:             Season;
    sessionID:          string;
    startUnixTime:      number | null;
    text:               string;
    time:               TimeOfDay;
    timeZone:           number;
    weekday:            DayOfWeek;
}

export interface IKeystrokeCollection extends IBaseKeystrokeCollection{
    length:             number;
    qualityCheck:       string[];   // Extra
    setting:            string;     // Extra
    source:             string;     // Extra
    startTimestamp?:    string;     // Custom
    study:              string;
    task:               string;
    textStructure:      string[];   // Extra
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type Season = 'Winter' | 'Spring' | 'Summer' | 'Fall';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';