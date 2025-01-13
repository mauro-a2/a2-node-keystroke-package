import type { TextFieldTypes } from "../interfaces";

export const getInputType = (target: HTMLInputElement): TextFieldTypes => {

    const hasAutocorrect = target.getAttribute('autocorrect') ? true : false;
    const isSpellcheckEnabled = target.spellcheck;

    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        return 'Text_ACOFF';
    }

    if (hasAutocorrect || isSpellcheckEnabled) { return 'Text' }

    return 'Text_ACOFF';
}