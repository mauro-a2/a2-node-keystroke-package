import { getInitialMobileTypingData, getKeyArea, getKeyCode, getKeyType } from "../helpers";
import type { IMobileKeystrokeCollection, IOpenKeyEntriesAndroid } from "../interfaces";
import { checkIsEmoji, getDifferenceBetweenWords, getEmojiUnicode, getInputType, getKeyboardArea } from "../utils";

export class AndroidKeystrokeManager {
    private isTypingSessionActive = false;
    private typingData: IMobileKeystrokeCollection = getInitialMobileTypingData();
    private openKeyEntry?: IOpenKeyEntriesAndroid = undefined;
    private textWasPasted = false;
    private previousText?: string = undefined;
    private backspaceWasPressed = false;
    private performanceStart = 0;
    private lastKeyPressed?: string = undefined;
    private prevContentLength = 0;

    get getIsTypingSessionActive() {
        return this.isTypingSessionActive;
    }

    /**
     * Process the input content before it changes
     * @param currentValue Current value of the input
     * @param inputContentValue Previous value of the input
     */
    processBeforeInput(currentValue: string, inputContentValue: string) {
        this.prevContentLength = currentValue.length;
        this.previousText = inputContentValue; // Before it changes
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
     * Process the autocorrection event
     * @param keyPressed Key that was pressed
     * @param newValue New value of the input
     */
    private processAutocorrection(keyPressed: string, newValue: string) {
        if (this.textWasPasted) {
            this.textWasPasted = false;
            return;
        }

        if (this.backspaceWasPressed) {
            this.backspaceWasPressed = false;
            return;
        }

        if (checkIsEmoji(keyPressed)) { return }

        if (keyPressed.length <= 1) { return }

        const diff = (Date.now() * 1000) - this.typingData.startUnixTime!; //* Microseconds
        let autocorrectedWord;

        //? If they are the same, it was already a correction
        if (keyPressed === newValue) {
            autocorrectedWord = keyPressed.trim().toLowerCase();
        }

        autocorrectedWord = getDifferenceBetweenWords(newValue, this.previousText!);

        if (autocorrectedWord.length === 0) { return }

        this.previousText = undefined;
        this.typingData = {
            ...this.typingData,
            autocorrectLengths: [...this.typingData.autocorrectLengths, autocorrectedWord.length],
            autocorrectTimes: [...this.typingData.autocorrectTimes, diff],
        }
    }

    /**
     * Process the key input event
     * @param inputContent Content of the input
     */
    processKeyInput(inputContent: string) {
        const diff = inputContent.length - this.prevContentLength;
        let keyPressed = inputContent.slice(-diff);

        if (diff < 1) {
            this.backspaceWasPressed = true;
            keyPressed = 'Backspace';
        }

        this.lastKeyPressed = keyPressed;

        this.processAutocorrection(keyPressed, inputContent);

        //? Ensure a key press event is not duplicated
        if (this.openKeyEntry?.keyValue === keyPressed) { return }

        this.openKeyEntry = { keyValue: keyPressed }
    }

    processKeydown(target: HTMLInputElement) {
        this.performanceStart = performance.now();
        const temporalStartUnixTime = Date.now() * 1000; //* Microseconds

        if (!this.isTypingSessionActive) {
            this.isTypingSessionActive = true;
            this.typingData = {
                ...this.typingData,
                textField: getInputType(target),
                keyboardArea: getKeyboardArea(),
                startUnixTime: temporalStartUnixTime, //* Set start time only once
                pressTimes: [...this.typingData.pressTimes, 0], //* Compute relative time in microseconds
            }
            return;
        }

        const pressTime = (Date.now() * 1000) - this.typingData.startUnixTime!; //* Compute relative time in microseconds

        this.typingData = {
            ...this.typingData,
            pressTimes: [...this.typingData.pressTimes, pressTime],
        }
    }

    processKeyup() {
        let emojiUnicode: string | undefined;

        const keyCode = getKeyCode(this.lastKeyPressed!);
        const keyArea = getKeyArea(this.lastKeyPressed!);
        const keyType = getKeyType(this.lastKeyPressed!);

        //? If is emoji
        if (keyCode === 900) {
            emojiUnicode = getEmojiUnicode(this.lastKeyPressed!, true);
        }

        const performanceEnd = performance.now();
        this.typingData = {
            ...this.typingData,
            releaseTimes: [...this.typingData.releaseTimes, (Date.now() * 1000) - this.typingData.startUnixTime!], //* Compute relative time in microseconds
            performance: [...this.typingData.performance, (performanceEnd - this.performanceStart)], //* Milliseconds
            keyArea: [...this.typingData.keyArea, keyArea],
            keyTypes: [...this.typingData.keyTypes, keyType],
            emojis: [...this.typingData.emojis, ...(emojiUnicode ? [emojiUnicode] : [])],
        }

        this.openKeyEntry = undefined;
    }

    endTypingSession() {
        this.isTypingSessionActive = false;
        return this.typingData;
    }

    resetTypingData() {
        this.typingData = getInitialMobileTypingData();
        this.performanceStart = 0;
    }
}