import process from 'node:process';
import googleTranslate, { type TranslationOption as GoogleTranslationOption } from '@kabeep/node-translate';
import ky, { type HTTPError } from 'ky';
import set from 'lodash.set';
import {
    translate as microsoftTranslate,
    type TranslationResult as MicrosoftTranslationOption,
} from 'microsoft-translate-api';
import { $t, languageDictionary, type LanguageOptions } from '../shared';
import { ensure, fuzzySearch, type LanguageRecord, type NodeError, to } from '../utils';

export type TranslateEngine = (typeof TRANSLATE_ENGINES)[number];

// eslint-disable-next-line @typescript-eslint/naming-convention
const TRANSLATE_ENGINES = ['google', 'microsoft', 'deeplx'] as const;

export interface TranslateOptions {
    engine: TranslateEngine;
    to: LanguageRecord<LanguageOptions>['code'] | Lowercase<LanguageRecord<LanguageOptions>['code']>;
    from?: string;
    protect?: boolean;
    separator?: string;
}

interface DeeplxTranslateOptions {
    id: number;
    code: number;
    method: string;
    source_lang: string;
    target_lang: string;
    data?: string;
    alternatives?: string[];
}

function didYouMeanEngine(engine: string): string | undefined {
    return TRANSLATE_ENGINES.find((presetEngine) => fuzzySearch(engine.toLowerCase(), presetEngine.toLowerCase()));
}

function createUnsupportedEngineMessage(engine?: string) {
    return () => {
        if (!engine) {
            return $t('EINVAL_MISSING_ENGINE');
        }

        const prefix = $t('EINVAL_UNSUPPORTED_ENGINE', { engine });
        const didYouMean = didYouMeanEngine(engine);
        return didYouMean ? `${prefix}, ${$t('DID_YOU_MEAN', { mean: didYouMean })}?` : prefix;
    };
}

export function validateTranslateEngine(engine?: string): engine is (typeof TRANSLATE_ENGINES)[number] {
    ensure(
        engine && (TRANSLATE_ENGINES as readonly string[]).includes(engine),
        createUnsupportedEngineMessage(engine),
        'EINVAL_TRANSLATE_OPTION_ENGINE',
    );
    return true;
}

export function didYouMeanTarget(lang: string): string | undefined {
    return languageDictionary
        .getAllCodes()
        .find((languageCode) => fuzzySearch(lang.toLowerCase(), languageCode.toLowerCase()));
}

function createUnsupportedTargetMessage(target?: string) {
    return () => {
        if (!target) {
            return $t('EINVAL_MISSING_TO');
        }

        const prefix = $t('EINVAL_UNSUPPORTED_TO', { target });
        const didYouMean = didYouMeanTarget(target);
        return didYouMean ? `${prefix}, ${$t('DID_YOU_MEAN', { mean: didYouMean })}?` : prefix;
    };
}

export function validateTranslateLanguage(
    language?: string,
    errorCode?: string,
): language is LanguageRecord<LanguageOptions>['code'] {
    ensure(language && languageDictionary.validate(language), createUnsupportedTargetMessage(language), errorCode);
    return true;
}

function protectVariables(text: string): { modifiedText: string; variables: string[] } {
    const variables: string[] = [];
    const modifiedText = text.replace(/(\[.*?]|{.*?})/g, (match) => {
        variables.push(match);
        return `{%VAR${variables.length}}`;
    });
    return { modifiedText, variables };
}

function restoreVariables(translation: string, variables: string[]): string {
    return translation.replace(/{%VAR(\d+)}/g, (_, numeric: number) => {
        return variables[numeric - 1];
    });
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function googleTranslateVO(translation: GoogleTranslationOption | undefined): string | undefined {
    return translation?.to?.text?.value;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function microsoftTranslateVO(translation: MicrosoftTranslationOption[] | undefined): string | undefined {
    return translation?.[0]?.translations?.[0]?.text;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function deeplxTranslateVO(translation: DeeplxTranslateOptions) {
    return translation?.data;
}

async function deeplxTranslate(text: string, options: { from: string; to: string; port?: string }) {
    const servePort = options.port ?? process.env.DEEPLX_PORT ?? '1188';
    const token = process.env.DEEPLX_TOKEN;
    const deeplxHeaders = {
        'Content-Type': 'application/json',
    };
    if (token) set(deeplxHeaders, 'Authorization', `Bearer ${token}`);

    const [error, response] = await to<DeeplxTranslateOptions, HTTPError>(
        ky
            .post<DeeplxTranslateOptions>(`http://127.0.0.1:${servePort}/translate`, {
                headers: deeplxHeaders,
                json: {
                    text,
                    source_lang: options.from, // eslint-disable-line @typescript-eslint/naming-convention
                    target_lang: options.to, // eslint-disable-line @typescript-eslint/naming-convention
                },
            })
            .json(),
    );
    ensure(error?.response?.status !== 429, $t('ECONNREFUSED_DEEPLX_LIMITED'), 'ECONNREFUSED_DEEPLX_LIMITED');
    ensure(error?.message !== 'fetch failed', $t('ECONNABORTED_DEEPLX', { port: servePort }), 'ECONNABORTED_DEEPLX');
    ensure(
        !error && response,
        $t('ECONNREFUSED_DEEPLX', { message: error?.response?.statusText ?? error?.message ?? 'Unknown error' }),
        'ECONNREFUSED_DEEPLX',
    );

    return response;
}

async function flexibleTranslate(text: string, options: TranslateOptions): Promise<string | undefined> {
    const { engine, from, to: target } = options;
    const translateFrom = from ? languageDictionary.getLanguage(from)![engine]! : undefined;
    const translateTo = languageDictionary.getLanguage(target)![engine]!;

    // If you want to add more, please exhaustive them below
    switch (engine) {
        case 'google': {
            return googleTranslateVO(await googleTranslate(text, { from: translateFrom, to: translateTo }));
        }

        case 'microsoft': {
            return microsoftTranslateVO(await microsoftTranslate(text, translateFrom, translateTo));
        }

        case 'deeplx': {
            return deeplxTranslateVO(await deeplxTranslate(text, { from: translateFrom ?? 'EN', to: translateTo }));
        }
    }
}

async function translate<T extends string | string[]>(
    text: T,
    options: TranslateOptions,
): Promise<T extends string ? string : string[]> {
    const { protect, separator = '\n{%}\n' } = options;

    const isMultiple: boolean = Array.isArray(text);
    const sourceList: string[] = isMultiple ? (text as string[]) : [text as string];

    const protections = sourceList.map((item) =>
        protect ? protectVariables(item) : { modifiedText: item, variables: [] },
    );
    const composite: string = protections.map((item) => item.modifiedText).join(separator);

    const [error, translation] = await to<string | undefined, NodeError>(flexibleTranslate(composite, options));
    ensure(!error && translation, error?.message, 'EINVAL_TRANSLATE_RESPONSE');

    const translationList = translation.split(separator);
    ensure(
        translationList.length === sourceList.length,
        $t('EINVAL_TOO_MANY_TRANSLATE_INPUT'),
        'EINVAL_TRANSLATE_TEXT_LIMITED',
    );

    const result = protect
        ? translationList.map((item, index) => {
              return restoreVariables(item, protections[index].variables);
          })
        : translationList;
    return (isMultiple ? result : result[0]) as T extends string ? string : string[];
}

export default translate;
