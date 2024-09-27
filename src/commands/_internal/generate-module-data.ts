import fs from 'node:fs';
import { getTranslationFileName } from '../../helper/index.js';
import { type LanguageRecord } from '../../shared/index.js';
import { ensure, type NodeError, to } from '../../utils/index.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';
import writeTranslationDataXml from './write-translation-data-xml.js';

async function generateModuleData(dictionary: ModuleDataDictionary, moduleDataPath: string, languages: LanguageRecord) {
    for (const fileName of fs.readdirSync(moduleDataPath)) {
        const [error] = await to<void, NodeError>(generateDataXmlFile(dictionary, moduleDataPath, fileName, languages));
        ensure(!error, error?.message ?? `An error occurred while organizing translate ${fileName} file`, error?.code);
    }

    return dictionary;
}

async function generateDataXmlFile(
    dictionary: ModuleDataDictionary,
    moduleDataPath: string,
    fileName: string,
    languages: LanguageRecord,
) {
    // { id1: { key, name }, id2: { key, name } }
    const scoped = dictionary.get(fileName);
    if (!scoped) return;

    const options = Object.entries(scoped).map(([_, option]) => option);

    const { code, nativeName } = languages;
    const translationFileName = getTranslationFileName(fileName, languages.code);
    writeTranslationDataXml(options, moduleDataPath, translationFileName, nativeName, code);
}

export default generateModuleData;
