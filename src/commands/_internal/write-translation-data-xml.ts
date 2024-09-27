import fs from 'node:fs';
import run from '../../utils/run.js';
import { translationDataXml } from '../../helper/index.js';

function writeTranslationDataXml(
    options: Array<{ key: string; name: string }>,
    moduleDataPath: string,
    fileName: string,
    langName: string,
    langCode: string,
) {
    const localeDirectory = `${moduleDataPath}\\Languages\\${langCode}`;
    const [error] = run(fs.accessSync, localeDirectory, fs.constants.R_OK);
    if (error) {
        fs.mkdirSync(localeDirectory, { recursive: true });
    }

    let updatedData = translationDataXml.create(langName, options);
    if (translationDataXml.check(localeDirectory, fileName)) {
        const legacyData = translationDataXml.read(localeDirectory, fileName);
        updatedData = translationDataXml.merge(legacyData, updatedData);
    }

    translationDataXml.write(localeDirectory, fileName, updatedData);
}

export default writeTranslationDataXml;
