
export interface IOpenKeyEntries {
    [key: string]: {
        pressTime:  number;
        keyCode:    number;
        keyArea:    number;
        keyType:    string;
    };
}

export interface IOpenKeyEntriesAndroid {
    keyValue: string;
}
