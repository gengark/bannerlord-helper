import get from 'lodash.get';
import { LanguageDataXml } from '../helper';
import { $t } from '../shared';
import { ensure, pathExist } from '../utils';

async function choiceModuleTemplateFiles(directoryPath: string, translateFrom: string) {
    const isExisted = pathExist(directoryPath);
    ensure(isExisted, $t('CMD_TRANSLATE_NO_LANGUAGES_DIR', { path: directoryPath }), 'ENOENT_LANGUAGES_DIR');

    const isCatalogExisted = pathExist(`${directoryPath}\\language_data.xml`);
    ensure(isCatalogExisted, $t('CMD_TRANSLATE_NO_LANGUAGES_CATALOG_FILE'), 'ENOENT_LANGUAGES_CATALOG_FILE');

    const instance = new LanguageDataXml();
    const languageData = instance.read(directoryPath);
    const languageFiles = get(languageData, 'LanguageData.LanguageFile', []);
    return instance
        .normalizeLanguageFile(languageFiles)
        .map((item) => item['@_xml_path'].replace(new RegExp(`^${translateFrom}/`), ''));
}

export default choiceModuleTemplateFiles;
