import fs from 'node:fs';
import partialRight from 'lodash.partialright';
import { getTranslationFileName, languageDataXml } from '../../helper/index.js';
import run from '../../utils/run.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';

function writeLanguageDataXml(
    dictionary: ModuleDataDictionary,
    moduleDataPath: string,
    langName: string,
    langCode: string,
) {
    const localeDirectory = `${moduleDataPath}\\Languages\\${langCode}`;
    const [error] = run(fs.accessSync, localeDirectory, fs.constants.R_OK);
    if (error) {
        fs.mkdirSync(localeDirectory, { recursive: true });
    }

    const fileList = [...dictionary.keys()].map((item) => getTranslationFileName(item, langCode));
    let updatedData = languageDataXml.create(langName, langCode, fileList);
    if (languageDataXml.check(localeDirectory)) {
        const legacyData = languageDataXml.read(localeDirectory);
        updatedData = languageDataXml.merge(legacyData, updatedData);
    }

    languageDataXml.write(localeDirectory, updatedData);
}

export default writeLanguageDataXml;
