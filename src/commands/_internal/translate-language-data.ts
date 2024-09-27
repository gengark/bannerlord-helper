import fs from 'node:fs';
import { translateApi } from '../../api/index.js';
import { getTranslationFileName } from '../../helper/index.js';
import { ErrorCodes, type LanguageRecord } from '../../shared/index.js';
import { ensure, type NodeError, run, to } from '../../utils/index.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';
import writeTranslationDataXml from './write-translation-data-xml.js';

async function translateLanguageData(
    dictionary: ModuleDataDictionary,
    moduleDataPath: string,
    sourceLanguage: LanguageRecord,
    targetLanguage: LanguageRecord,
    prefix = '',
    google = false,
) {
    let directoryPath: string;
    if (sourceLanguage.code === 'EN') {
        directoryPath = `${moduleDataPath}\\Languages\\${sourceLanguage.code}`;
        const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
        if (accessError) directoryPath = `${moduleDataPath}\\Languages`;
    } else {
        directoryPath = `${moduleDataPath}\\Languages\\${sourceLanguage.code}`;
        const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
        ensure(
            !accessError,
            accessError?.message ?? `Can not found \\Languages\\${sourceLanguage.code} directory`,
            ErrorCodes.ENOENT_FILE,
        );
    }

    for (const fileName of fs.readdirSync(directoryPath)) {
        const [error] = await to<void, NodeError>(
            translateDataXmlFile(dictionary, moduleDataPath, fileName, sourceLanguage, targetLanguage, prefix, google),
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
    prefix = '',
    google = false,
) {
    // { id1: { key, name }, id2: { key, name } }
    const scoped = dictionary.get(fileName);
    if (!scoped) return;

    const options = Object.entries(scoped).map(([_, option]) => option);
    const itemNames = options.map((item) => item.name);

    const { code, google: googleCode, bing: bingCode, nativeName } = targetLanguage;
    const target = google ? googleCode : bingCode;
    const source = google ? sourceLanguage.google : sourceLanguage.bing;
    const translations = await translateApi.messages(itemNames, { google, to: target, from: source });
    const translateOptions = options.map((item, index) => ({ ...item, name: `${prefix}${translations[index]}` }));

    const translationFileName = getTranslationFileName(fileName, targetLanguage.code);
    writeTranslationDataXml(translateOptions, moduleDataPath, translationFileName, nativeName, code);
}

export default translateLanguageData;
