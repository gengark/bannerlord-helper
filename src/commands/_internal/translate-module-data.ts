import fs from 'node:fs';
import { translateApi } from '../../api/index.js';
import { getTranslationFileName } from '../../helper/index.js';
import { type LanguageRecord } from '../../shared/index.js';
import { ensure, type NodeError, to } from '../../utils/index.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';
import writeTranslationDataXml from './write-translation-data-xml.js';

async function translateModuleData(
    dictionary: ModuleDataDictionary,
    moduleDataPath: string,
    languages: LanguageRecord,
    prefix = '',
    google = false,
) {
    for (const fileName of fs.readdirSync(moduleDataPath)) {
        const [error] = await to<void, NodeError>(
            translateDataXmlFile(dictionary, moduleDataPath, fileName, languages, prefix, google),
        );
        ensure(!error, error?.message ?? `An error occurred while organizing translate ${fileName} file`, error?.code);
    }

    return dictionary;
}

async function translateDataXmlFile(
    dictionary: ModuleDataDictionary,
    moduleDataPath: string,
    fileName: string,
    languages: LanguageRecord,
    prefix = '',
    google = false,
) {
    // { id1: { key, name }, id2: { key, name } }
    const scoped = dictionary.get(fileName);
    if (!scoped) return;

    const options = Object.entries(scoped).map(([_, option]) => option);
    const itemNames = options.map((item) => item.name);

    const { code, google: googleCode, bing: bingCode, nativeName } = languages;
    const target = google ? googleCode : bingCode;
    const translations = await translateApi.messages(itemNames, { google, to: target });
    const translateOptions = options.map((item, index) => ({ ...item, name: `${prefix}${translations[index]}` }));

    const translationFileName = getTranslationFileName(fileName, languages.code);
    writeTranslationDataXml(translateOptions, moduleDataPath, translationFileName, nativeName, code);
}

export default translateModuleData;
