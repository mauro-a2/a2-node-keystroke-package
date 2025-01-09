
import type { IKeystrokeCollection, IOpenKeyEntries } from "../interfaces";
import { getInitialTypingData, getKeyArea, getKeyCode, getKeyType } from "../helpers";

export class KeystrokeManager {
    private isTypingSessionActive = false;
    private typingData: IKeystrokeCollection = getInitialTypingData();
    private openKeyEntries: IOpenKeyEntries = {};

    get getIsTypingSessionActive() {
        return this.isTypingSessionActive;
    }

    handleInputChange(newValue: string) {
        this.typingData = {
            ...this.typingData,
            length: newValue.length,
        };
    }

    handleKeydown(keyPressed: string) {
        const temporalStartUnixTime = Date.now() * 1000; //* Microseconds

        if (!this.isTypingSessionActive) {
            this.isTypingSessionActive = true;
            this.typingData = {
                ...this.typingData,
                startUnixTime: temporalStartUnixTime, //* Set start time only once
            };
        }

        //? Ensure a key press event is not duplicated
        if (keyPressed in this.openKeyEntries) return;

        const pressTime = (Date.now() * 1000) - this.typingData.startUnixTime!; //* Compute relative time in microseconds
        this.openKeyEntries[keyPressed] = {
            pressTime,
            keyCode: getKeyCode(keyPressed),
            keyArea: getKeyArea(keyPressed),
            keyType: getKeyType(keyPressed),
        };
    }

    handleKeyup(keyPressed: string) {
        if (!(keyPressed in this.openKeyEntries)) return;

        const keyEntry = this.openKeyEntries[keyPressed];

        this.typingData = {
            ...this.typingData,
            pressTimes: [...this.typingData.pressTimes, keyEntry.pressTime],
            releaseTimes: [
                ...this.typingData.releaseTimes,
                (Date.now() * 1000) - this.typingData.startUnixTime!, //* Compute relative time in microseconds
            ],
            keyCode: [...this.typingData.keyCode, keyEntry.keyCode],
            keyArea: [...this.typingData.keyArea, keyEntry.keyArea],
            keyTypes: [...this.typingData.keyTypes, keyEntry.keyType],
        };

        delete this.openKeyEntries[keyPressed];
    }

    endTypingSession() {
        this.isTypingSessionActive = false;
        return this.typingData;
    }

    resetTypingData() {
        this.typingData = getInitialTypingData();
        this.openKeyEntries = {};
    }
}
