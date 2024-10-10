import { validateTranslateLanguage } from '../api';
import { LanguageDataXml } from '../helper';
import { languageDictionary } from '../shared';
import { pathExist } from '../utils';

function writeLanguageDataFile(directoryPath: string, code: string, files: string[]) {
    validateTranslateLanguage(code, 'EINVAL_LANGUAGE_DATA_CODE');
    const language = languageDictionary.getLanguage(code);

    const instance = new LanguageDataXml();
    const data = pathExist(instance.resolve(directoryPath)) ? instance.read(directoryPath) : undefined;
    const source = instance.create(language!.nativeName, language!.code, files);
    const composite = data ? instance.merge(data, source) : source;
    instance.write(directoryPath, composite);
}

export default writeLanguageDataFile;
