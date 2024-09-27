import fs from 'node:fs';
import { getTranslationFileName } from '../../helper/index.js';
import { type LanguageRecord, Languages } from '../../shared/index.js';
import { ensure, type NodeError, run } from '../../utils/index.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';
import writeLanguageDataXml from './write-language-data-xml.js';
import writeTranslationDataXml from './write-translation-data-xml.js';

function generateEventsTemplate(dictionary: ModuleDataDictionary, moduleDataPath: string, eventsPath: string) {
    const language = Languages.getLanguages(['en'])[0];
    writeLanguageDataXml(dictionary, moduleDataPath, language!.nativeName, language!.code);

    for (const fileName of fs.readdirSync(eventsPath)) {
        const [error] = run<void, NodeError>(generateDataXmlFile, dictionary, moduleDataPath, fileName, language);
        ensure(!error, error?.message ?? `An error occurred while organizing translate ${fileName} file`, error?.code);
    }

    return dictionary;
}

function generateDataXmlFile(
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

export default generateEventsTemplate;
