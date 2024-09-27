import googleTranslate, { type TranslateOptions } from '@kabeep/node-translate';
import chunk from 'lodash.chunk';
import { translate as bingTranslate } from 'microsoft-translate-api';
import { osLocaleSync } from 'os-locale';
import { Languages } from '../shared/index.js';
import to from '../utils/to.js';

export interface FlexibleTranslateOptions extends TranslateOptions {
    google?: boolean;
}

function getIsoCode() {
    // `${ISO-639-1}-${ISO-3166}`
    const isoCode = osLocaleSync();

    const part = isoCode.split('-')[0];
    if (Languages.validate(part)) {
        return Languages.getLanguages([part])[0]!.bing;
    }

    switch (isoCode) {
        case 'zh-CN': {
            return 'zh-Hans';
        }

        case 'zh-HK':
        case 'zh-TW': {
            return 'zh-Hant';
        }

        default: {
            return part;
        }
    }
}

export async function flexible(text: string, options?: FlexibleTranslateOptions): Promise<string> {
    if (options?.google) {
        const translation = await googleTranslate(text, options);
        return translation?.to?.text?.value ?? text;
    }

    const translation = await bingTranslate(text, options?.from || null, options?.to || getIsoCode());
    return translation?.[0]?.translations?.[0]?.text ?? text;
}

/**
 * Translates a batch of strings in a single network request, improving efficiency
 * by reducing the number of requests sent to the translation service.
 *
 * @param {string[]} texts - The list of strings to translate.
 * @param {FlexibleTranslateOptions} options - The options for translator.
 * @return {Promise<string[]>} A promise that resolves to an array of translated strings.
 * @throws {Error} Throws an error if the translation fails.
 * @see [node-translate]{@link https://github.com/kabeep/node-translate}
 * @example
 *
 * // => ['Hola', 'Mundo']
 * await translateBatch(['Hello', 'World'], { from: 'en', to: 'spanish' });
 *
 * // => ['你好', '世界']
 * await translateBatch(['Hello', 'World'], { to: 'zh', bing: google });
 */
export async function batch(texts: string[], options?: FlexibleTranslateOptions): Promise<string[]> {
    if (texts.length === 0) return [];

    const separator = '|||';
    const chunkSize = 100;
    const parts = chunk(texts, chunkSize);

    const result: string[] = [];
    for (const part of parts) {
        const original = part.join(separator);
        const response = await flexible(original, options);

        const translations = response.split(separator);
        result.push(...translations);
    }

    return result;
}

interface ProtectedVariables {
    modifiedText: string;
    variables: string[];
}

/**
 * Extract variable names from a string and replace them with placeholders
 * @param {string} text - text to process
 * @returns Modified text and the extracted variable name array
 */
function protectVariables(text: string): ProtectedVariables {
    const variables: string[] = [];
    const modifiedText = text.replace(/(\[.*?]|{.*?})/g, (match) => {
        variables.push(match);
        return `%VAR${variables.length}%`;
    });
    return { modifiedText, variables };
}

/**
 * Revert placeholders in translated text to original variable names
 * @param {string} translation
 * @param {string[]} variables - Array of variable names extracted previously
 * @returns Complete text after restoration
 */
function restoreVariables(translation: string, variables: string[]): string {
    return translation.replace(/%VAR(\d+)%/g, (match, number) => {
        return variables[Number.parseInt(number, 10) - 1];
    });
}

export async function messages(
    messages: string,
    options?: FlexibleTranslateOptions & { protect?: boolean },
): Promise<string>;
export async function messages(
    messages: string[],
    options?: FlexibleTranslateOptions & { protect?: boolean },
): Promise<string[]>;
export async function messages(
    messages?: string | string[],
    options?: FlexibleTranslateOptions & { protect?: boolean },
): Promise<string | string[]> {
    if (!messages) return '';
    const isSingle = typeof messages === 'string';

    const original = isSingle ? [messages] : messages;
    const { protect = true } = options || {};
    const records = original.map(protectVariables);

    const [error, translations] = await to(
        batch(protect ? records.map((item) => item.modifiedText) : original, options),
    );
    if (error || !translations) {
        return messages;
    }

    const result = protect
        ? translations.map((item, index) => {
              return restoreVariables(item, records[index].variables);
          })
        : translations;
    return isSingle ? result[0] : result;
}
