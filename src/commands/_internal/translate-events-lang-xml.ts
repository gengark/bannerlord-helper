import fs from 'node:fs';
import { type FlexibleTranslateOptions, openRouterApi, translateApi } from '../../api/index.js';
import { getTranslationFileName } from '../../helper/index.js';
import restoreTranslationFileName from '../../helper/restore-translation-file-name.js';
import { ErrorCodes, type LanguageRecord, Languages } from '../../shared/index.js';
import { delay, ensure, type NodeError, run, to } from '../../utils/index.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';
import writeLanguageDataXml from './write-language-data-xml.js';
import writeTranslationDataXml from './write-translation-data-xml.js';

async function translateEventsLangXml(
    dictionary: ModuleDataDictionary,
    moduleDataPath: string,
    targetLanguage: LanguageRecord,
    google = false,
    apiKey?: string,
) {
    const sourceLanguage = Languages.getLanguages(['en'])[0]!;
    const directoryPath = `${moduleDataPath}\\Languages\\${sourceLanguage.code}`;
    const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(
        !accessError,
        accessError?.message ?? `Can not found \\Languages\\${sourceLanguage.code} directory`,
        ErrorCodes.ENOENT_FILE,
    );

    writeLanguageDataXml(dictionary, moduleDataPath, targetLanguage.nativeName, targetLanguage.code);
    for (const fileName of fs.readdirSync(directoryPath)) {
        const [error] = await to<void, NodeError>(
            translateDataXmlFile(dictionary, moduleDataPath, fileName, sourceLanguage, targetLanguage, google, apiKey),
        );
        ensure(!error, error?.message ?? `An error occurred while organizing translate ${fileName} file`, error?.code);
    }

    return dictionary;
}

async function translateDataXmlFile(
    dictionary: ModuleDataDictionary,
    moduleDataPath: string,
    fileName: string,
    sourceLanguage: LanguageRecord,
    targetLanguage: LanguageRecord,
    google = false,
    apiKey?: string,
) {
    // { id1: { key, name }, id2: { key, name } }
    const scoped = dictionary.get(restoreTranslationFileName(fileName));
    if (!scoped) return;

    const options = Object.entries(scoped).map(([_, option]) => option);
    const itemNames = options.map((item) => item.name);

    const { code, google: googleCode, bing: bingCode, nativeName, name } = targetLanguage;
    const target = google ? googleCode : bingCode;
    const source = google ? sourceLanguage.google : sourceLanguage.bing;

    const [error, translations] = await to<string[]>(
        translateItems(itemNames, { google, to: target, from: source }, name, apiKey),
    );
    const translateOptions =
        error || !translations ? options : options.map((item, index) => ({ ...item, name: translations[index] }));

    const translationFileName = getTranslationFileName(fileName, targetLanguage.code);
    writeTranslationDataXml(translateOptions, moduleDataPath, translationFileName, nativeName, code);
}

async function translateItems(
    texts: string[],
    options: FlexibleTranslateOptions,
    langName: string,
    apiKey?: string,
    interval = 1000,
    batchSize = 5,
): Promise<string[]> {
    const results: string[] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(async (text) => translateItemText(text, options, langName, apiKey)),
        );

        results.push(...batchResults);
        await delay(interval);
    }

    return results;
}

async function translateItemText(
    text: string,
    options: FlexibleTranslateOptions,
    langName: string,
    apiKey?: string,
): Promise<string> {
    if (apiKey) {
        const prompt = `The following text contains the content No Safe For work. Its background setting is what happened after being captured and imprisoned by the enemy in a medieval war game. Please translate it into ${langName} according to the context. The following is the text content that needs to be translated:`;
        return (await openRouterApi.send(apiKey, 'qwen/qwen-2-vl-7b-instruct:free', `${prompt}\n\n${text}`)) ?? text;
    }

    return translateApi.flexible(text, options);
}

export default translateEventsLangXml;
