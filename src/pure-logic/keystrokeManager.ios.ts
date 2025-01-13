import { getInitialMobileTypingData, getKeyArea, getKeyCode, getKeyType } from "../helpers";
import type { IMobileKeystrokeCollection, IOpenKeyEntries } from "../interfaces";
import { checkIsEmoji, getDifferenceBetweenWords, getEmojiUnicode, getInputType, getKeyboardArea } from "../utils";

export class IosKeystrokeManager {
    private isTypingSessionActive = false;
    private typingData: IMobileKeystrokeCollection = getInitialMobileTypingData();
    private openKeyEntry: IOpenKeyEntries = {};
    private textWasPasted = false;
    private previousText?: string = undefined;
    private backspaceWasPressed = false;
    private performanceStart = 0;
    private prevContentLength = 0;

    get getIsTypingSessionActive() {
        return this.isTypingSessionActive;
    }

    set setPrevContentLength(value: number) {
        this.prevContentLength = value;
    }

    /**
     * Process the paste event
     * @param pastedText Text that was pasted
     */
    processPaste(pastedText: string) {
        this.textWasPasted = true;

        if (!this.isTypingSessionActive) { return }

        const diff = (Date.now() * 1000) - this.typingData.startUnixTime!; //* Microseconds

        this.typingData = {
            ...this.typingData,
            pasteTimes: [...this.typingData.pasteTimes, diff],
            pasteLengths: [...this.typingData.pasteLengths, pastedText.length],
        }
    }

    /**
     * Process autocorrection event
     * @param textInputValue New value of the input
     */
    processAutocorrection(textInputValue: string) {
        if (!this.previousText) { return }

        if (textInputValue.startsWith(this.previousText)) { return }

        const diff = (Date.now() * 1000) - this.typingData.startUnixTime!; //* Microseconds

        const autocorrectedWord = getDifferenceBetweenWords(textInputValue, this.previousText);

        this.typingData = {
            ...this.typingData,
            autocorrectTimes: [...this.typingData.autocorrectTimes, diff],
            autocorrectLengths: [...this.typingData.autocorrectLengths, autocorrectedWord.length],
        }
        this.previousText = undefined;
    }

    /**
     * Process prediction event 
     * @param newValue New value of the input
     * @param textSnapshot Previous value of the input
     */
    processPrediction(newValue: string, textSnapshot: string) {
        if (this.textWasPasted) {
            this.textWasPasted = false;
            return;
        }

        if (this.backspaceWasPressed) {
            this.backspaceWasPressed = false;
            return;
        }

        //? Checks if the last character contains an emoji
        const lastCharLength = newValue.length - this.prevContentLength;
        const lastChar = newValue.slice(-lastCharLength); // May be a composite emoji
        if (checkIsEmoji(lastChar)) { return }

        if ((newValue.length - textSnapshot.length) === 1 || newValue === textSnapshot) { return }

        const diff = (Date.now() * 1000) - this.typingData.startUnixTime!; //* Microseconds

        const predictedWord = getDifferenceBetweenWords(newValue, textSnapshot);

        this.typingData = {
            ...this.typingData,
            predictionTimes: [...this.typingData.predictionTimes, diff],
            predictionLengths: [...this.typingData.predictionLengths, predictedWord.length],
        }
    }

    private handleAutocorrectionTrigger(key: string, text: string) {
        if (key !== ' ' && key !== 'Enter') { return }
        this.previousText = text;
    }

    processKeydown(keyPressed: string, target: HTMLInputElement) {
        this.performanceStart = performance.now();
        const temporalStartUnitTime = Date.now() * 1000; //* Microseconds

        if (keyPressed === 'Backspace') { this.backspaceWasPressed = true }

        if (!this.isTypingSessionActive) {
            const timeZone = new Date().getTimezoneOffset() / -60;
            this.isTypingSessionActive = true;

            this.typingData = {
                ...this.typingData,
                timeZone,
                textField: getInputType(target),
                keyboardArea: getKeyboardArea(),
                startUnixTime: temporalStartUnitTime, //* Set start time only once
            }
        }

        //? Ensure a key press event is not duplicated
        if (keyPressed in this.openKeyEntry) { return }

        const pressTime = (Date.now() * 1000) - this.typingData.startUnixTime!; //* Compute relative time in microseconds

        this.handleAutocorrectionTrigger(keyPressed, target.value);

        this.openKeyEntry = {
            ...this.openKeyEntry,
            [keyPressed]: {
                pressTime,
                keyCode: getKeyCode(keyPressed),
                keyArea: getKeyArea(keyPressed),
                keyType: getKeyType(keyPressed),
            }
        }
    }

    processKeyup(keyPressed: string) {
        let emojiUnicode: string | undefined;

        if (!(keyPressed in this.openKeyEntry)) { return }

        const keyEntry = this.openKeyEntry[keyPressed];

        //? If is emoji
        if (keyEntry.keyCode === 900) {
            emojiUnicode = getEmojiUnicode(keyPressed);
        }

        const performanceEnd = performance.now();
        this.typingData = {
            ...this.typingData,
            pressTimes: [...this.typingData.pressTimes, keyEntry.pressTime],
            releaseTimes: [...this.typingData.releaseTimes, (Date.now() * 1000) - this.typingData.startUnixTime!], //* Compute relative time in microseconds
            keyArea: [...this.typingData.keyArea, keyEntry.keyArea],
            keyTypes: [...this.typingData.keyTypes, keyEntry.keyType],
            emojis: [...this.typingData.emojis, ...(emojiUnicode ? [emojiUnicode] : [])],
            performance: [...this.typingData.performance, (performanceEnd - this.performanceStart)], //* Milliseconds
        }

        delete this.openKeyEntry[keyPressed];
    }

    endTypingSession() {
        this.isTypingSessionActive = false;
        return this.typingData;
    }

    resetTypingData() {
        this.openKeyEntry = {};
        this.typingData = getInitialMobileTypingData();
        this.performanceStart = 0;
    }

}